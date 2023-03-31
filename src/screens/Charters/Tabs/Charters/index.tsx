import React, {useEffect, useState} from 'react'
import {
  RefreshControl,
  StyleSheet,
  TouchableOpacity,
  Platform,
  Dimensions,
} from 'react-native'
import {
  Text,
  Box,
  FlatList,
  VStack,
  HStack,
  Input,
  Icon,
  Divider,
  Center,
  Image,
  Modal,
  Button,
  useToast,
} from 'native-base'
import {ms} from 'react-native-size-matters'
import moment from 'moment'
import MaterialIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import Pdf from 'react-native-pdf'
import {PDFDocument} from 'pdf-lib'

import {useCharters, useEntity} from '@bluecentury/stores'
import {Colors} from '@bluecentury/styles'
import {CharterStatus, LoadingAnimated} from '@bluecentury/components'
import {
  CHARTER_CONTRACTOR_STATUS_ACCEPTED,
  CHARTER_CONTRACTOR_STATUS_ARCHIVED,
  CHARTER_CONTRACTOR_STATUS_REFUSED,
  CHARTER_ORDERER_STATUS_COMPLETED,
  ENTITY_TYPE_EXPLOITATION_GROUP,
  ENTITY_TYPE_EXPLOITATION_VESSEL,
} from '@bluecentury/constants'
import {decode as atob, encode as btoa} from 'base-64'
import ReactNativeBlobUtil from 'react-native-blob-util'
import {useTranslation} from 'react-i18next'
const RNFS = require('react-native-fs')

export default function Charters({navigation, route}: any) {
  const {t} = useTranslation()
  const toast = useToast()
  const {
    isCharterLoading,
    charters,
    signedDocumentsArray,
    getCharters,
    viewPdf,
    updateCharterStatus,
    addSignedDocument,
    signatureId,
    getSignature,
    setSignatureId,
    updateCharterStatusResponse,
  } = useCharters()
  const {entityType, vesselId} = useEntity()
  const [searchedValue, setSearchValue] = useState('')
  const [chartersData, setChartersData] = useState(
    route === 'charters'
      ? charters.filter(c => c.children && c.children.length === 0)
      : charters.filter(
          c =>
            (c.children && c.children.length > 0) ||
            (!c.parent && !c.navigationLogs) ||
            c.navigationLogs.length === 0
        )
  )
  const [reviewPDF, setReviewPDF] = useState(false)
  const [path, setPath] = useState('')
  const [selectedCharter, setSelectedCharter] = useState(null)
  const [signature, setSignature] = useState('')
  const [signatureArrayBuffer, setSignatureArrayBuffer] = useState(null)
  const [pageWidth, setPageWidth] = useState(0)
  const [pageHeight, setPageHeight] = useState(0)
  const [pdfBase64, setPdfBase64] = useState(null)
  const [pdfArrayBuffer, setPdfArrayBuffer] = useState(null)
  const [isPdfSigned, setIsPdfSigned] = useState(false)
  const source = {uri: path, cache: true}

  useEffect(() => {
    setSignatureId('')
    addSignedDocument([])
  }, [])

  useEffect(() => {
    getCharters()
  }, [vesselId])

  useEffect(() => {
    if (path) {
      readFile()
    }
  }, [path])

  const readFile = () => {
    ReactNativeBlobUtil.fs.readFile(path, 'base64').then(contents => {
      setPdfBase64(contents)
      setPdfArrayBuffer(_base64ToArrayBuffer(contents))
    })
  }

  useEffect(() => {
    getCharters()
  }, [updateCharterStatusResponse])

  const showToast = (text: string, res: string) => {
    toast.show({
      duration: 1000,
      render: () => {
        return (
          <Text
            bg={res === 'success' ? 'emerald.500' : 'red.500'}
            color={Colors.white}
            mb={5}
            px="2"
            py="1"
            rounded="sm"
          >
            {text}
          </Text>
        )
      },
    })
  }

  const isLoaded = (cargo: any[]) => {
    if (cargo && cargo.some(e => e.isLoaded === false)) {
      return true
    } else {
      return false
    }
  }

  const getStatus = (
    charter: {ordererStatus: string; contractorStatus: string},
    selectedEntityType: string
  ) => {
    if (
      charter.ordererStatus === CHARTER_ORDERER_STATUS_COMPLETED &&
      charter.contractorStatus !== CHARTER_CONTRACTOR_STATUS_ARCHIVED
    ) {
      return CHARTER_ORDERER_STATUS_COMPLETED
    }

    if (charter.contractorStatus === CHARTER_CONTRACTOR_STATUS_ARCHIVED) {
      return charter.contractorStatus
    }

    return selectedEntityType === ENTITY_TYPE_EXPLOITATION_VESSEL ||
      selectedEntityType === ENTITY_TYPE_EXPLOITATION_GROUP
      ? charter.contractorStatus
      : charter.ordererStatus
  }

  const renderItem = ({item, index}: any) => {
    const status = getStatus(item, entityType)
    return (
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={() => onCharterSelected(item)}
      >
        <Box
          key={index}
          borderStyle={
            status === 'draft' || status === 'new' ? 'dashed' : 'solid'
          }
          borderColor={status === 'completed' ? Colors.secondary : Colors.grey}
          borderRadius={ms(5)}
          borderWidth={1}
          mb={ms(10)}
          overflow="hidden"
        >
          <HStack
            alignItems="center"
            justifyContent="space-between"
            pl={ms(12)}
            pr={ms(10)}
            py={ms(8)}
          >
            <VStack maxWidth="72%">
              <Text bold>
                {item.vesselReference || item.clientReference || t('unknown')}
              </Text>
              {item.navigationLogs &&
                item.navigationLogs.map(
                  (navlog: {bulkCargo: any[]}) =>
                    navlog.bulkCargo &&
                    navlog.bulkCargo.map(cargo => {
                      if (cargo.isLoading) {
                        return (
                          <Text
                            key={cargo?.id}
                            color={
                              item?.isActive || isLoaded(item?.cargo)
                                ? '#29B7EF'
                                : Colors.disabled
                            }
                            fontWeight="semibold"
                          >
                            {parseInt(cargo.amount) || 0} MT -{' '}
                            {cargo.type
                              ? cargo?.type?.nameEn || cargo?.type?.nameNl
                              : null}
                          </Text>
                        )
                      }
                    })
                )}
              <Text color={item.isActive ? Colors.black : Colors.disabled}>
                {item.charterDate
                  ? moment(item.charterDate).format('DD/MM/YYYY')
                  : 'TBD'}
              </Text>
            </VStack>
            <CharterStatus charter={item} entityType={entityType} />
          </HStack>
          <Box
            bg={status === 'completed' ? Colors.secondary : Colors.grey}
            bottom={0}
            left={0}
            position="absolute"
            top={0}
            width={ms(7)}
          />
        </Box>
      </TouchableOpacity>
    )
  }

  const onSearchCharter = (value: string) => {
    setSearchValue(value)
    const chartersTemp =
      route === 'charters'
        ? charters.filter(c => c.children && c.children.length === 0)
        : charters.filter(
            c =>
              (c.children && c.children.length > 0) ||
              (!c.parent && !c.navigationLogs) ||
              c.navigationLogs.length === 0
          )
    const searchedCharter = chartersTemp?.filter(charter => {
      const containsKey = value
        ? `${charter?.vesselReference?.toLowerCase()}`?.includes(
            value?.toLowerCase()
          )
        : true

      return containsKey
    })
    setChartersData(searchedCharter)
  }

  const onCharterSelected = async (charter: any) => {
    setSelectedCharter(charter)
    if (charter.contractorStatus === 'new' || signature) {
      const path = await viewPdf(charter.id)
      setPath(path)
      setReviewPDF(true)
    } else {
      navigation.navigate('CharterDetails', {charter: charter})
    }
  }

  const handleOnDecline = async () => {
    setReviewPDF(false)
    const status = {
      status: CHARTER_CONTRACTOR_STATUS_REFUSED,
      setContractorStatus: false,
    }
    const update = await updateCharterStatus(selectedCharter?.id, status)
    if (typeof update === 'string') {
      getCharters()
      showToast('Charter declined sucessfully.', 'success')
    } else {
      showToast('Charter declined failed.', 'failed')
    }
  }

  const handleOnAccept = async () => {
    setReviewPDF(false)
    const navigateToGetSignatureScreen = () => {
      navigation.navigate('CharterAcceptSign', {
        charter: selectedCharter,
        setSignature: setSignature,
        onCharterSelected: onCharterSelected,
      })
    }
    if (!signatureId) {
      navigateToGetSignatureScreen()
    } else {
      const response = await getSignature(
        signatureId,
        navigateToGetSignatureScreen
      )
      if (response.signature) {
        setSignature(response.signature.replace('data:image/png;base64,', ''))
        onCharterSelected(selectedCharter)
      } else {
        navigateToGetSignatureScreen()
      }
    }
  }

  const onPullToReload = () => {
    getCharters()
  }

  const _base64ToArrayBuffer = base64 => {
    const binary_string = atob(base64)
    const len = binary_string.length
    const bytes = new Uint8Array(len)
    for (let i = 0; i < len; i++) {
      bytes[i] = binary_string.charCodeAt(i)
    }
    return bytes.buffer
  }

  const _uint8ToBase64 = u8Arr => {
    const CHUNK_SIZE = 0x8000 //arbitrary number
    let index = 0
    const length = u8Arr.length
    let result = ''
    let slice
    while (index < length) {
      slice = u8Arr.subarray(index, Math.min(index + CHUNK_SIZE, length))
      result += String.fromCharCode.apply(null, slice)
      index += CHUNK_SIZE
    }
    return btoa(result)
  }

  const handleSingleTap = async (page, x, y) => {
    if (signature) {
      const signArrBuf = _base64ToArrayBuffer(signature)
      const pdfDoc = await PDFDocument.load(pdfArrayBuffer)
      const pages = pdfDoc.getPages()
      const firstPage = pages[page - 1]

      const signatureImage = await pdfDoc.embedPng(signArrBuf)
      if (Platform.OS == 'ios') {
        firstPage.drawImage(signatureImage, {
          x: (pageWidth * (x - 12)) / Dimensions.get('window').width,
          y: pageHeight - (pageHeight * (y + 12)) / 540,
          width: 100,
          height: 100,
        })
      } else {
        firstPage.drawImage(signatureImage, {
          x: (firstPage.getWidth() * x) / pageWidth,
          y:
            firstPage.getHeight() -
            (firstPage.getHeight() * y) / pageHeight -
            25,
          width: 50,
          height: 50,
        })
      }

      const pdfBytes = await pdfDoc.save()
      const pdfBase64 = _uint8ToBase64(pdfBytes)

      const status = {
        status: CHARTER_CONTRACTOR_STATUS_ACCEPTED,
        setContractorStatus: true,
      }
      const update = await updateCharterStatus(selectedCharter?.id, status)

      ReactNativeBlobUtil.fs
        .writeFile(`${path}_signed`, pdfBase64, 'base64')
        .then(success => {
          console.log('SIGNATURE_SUCCESS_NEW_PATH', success)
          setSignature('')
          setPath(`${path}_signed`)
          setPdfBase64(pdfBase64)
          setIsPdfSigned(true)
          const newSignedDocument = {
            charter_id: selectedCharter.id,
            path: `${path}_signed`,
          }
          addSignedDocument([...signedDocumentsArray, newSignedDocument])

          if (typeof update === 'string') {
            getCharters()
            showToast('Charter accepted sucessfully.', 'success')
          } else {
            showToast('Charter accepted failed.', 'failed')
          }
        })
        .catch(err => {
          console.log(err.message)
        })
    }
  }

  if (isCharterLoading) return <LoadingAnimated />

  return (
    <Box safeArea backgroundColor={Colors.white} flex="1" p={ms(12)}>
      <Input
        InputLeftElement={
          <Icon
            as={<MaterialIcons name="magnify" />}
            color={Colors.disabled}
            ml="2"
            size={5}
          />
        }
        w={{
          base: '100%',
        }}
        backgroundColor={Colors.light_grey}
        fontWeight="medium"
        placeholder="Search charter..."
        placeholderTextColor={Colors.disabled}
        size="sm"
        value={searchedValue}
        variant="filled"
        onChangeText={e => onSearchCharter(e)}
      />
      <Divider my={ms(15)} />

      <FlatList
        ListEmptyComponent={() => (
          <Text
            bold
            color={Colors.azure}
            fontSize={ms(20)}
            mt={ms(20)}
            textAlign="center"
          >
            {t('noCharters')}
          </Text>
        )}
        data={
          searchedValue !== ''
            ? chartersData
            : route === 'charters'
            ? charters.filter(c => c.children && c.children.length === 0)
            : charters.filter(
                c =>
                  (c.children && c.children.length > 0) ||
                  (!c.parent && !c.navigationLogs) ||
                  c.navigationLogs.length === 0
              )
        }
        refreshControl={
          <RefreshControl
            refreshing={isCharterLoading}
            onRefresh={onPullToReload}
          />
        }
        keyExtractor={item => `Charter-${item.id}`}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
      />

      <Modal
        animationPreset="slide"
        isOpen={reviewPDF}
        safeAreaTop={true}
        size="full"
        onClose={() => setReviewPDF(false)}
      >
        <Modal.Content bg="#23272F" style={styles.bottom}>
          {/* <HStack bg={Colors.black} py={ms(10)} px={ms(16)}>
            <Text
              flex="1"
              textAlign="center"
              color={Colors.white}
              fontSize={ms(12)}
              bold
            >
              {path?.replace(
                '/data/user/0/com.vemasysreactnativeapp/files/ReactNativeBlobUtilTmp_',
                ''
              )}
              .pdf
            </Text> */}
          {!signature ? (
            <TouchableOpacity
              style={{
                alignItems: 'flex-end',
                backgroundColor: Colors.black,
                paddingHorizontal: ms(16),
                paddingVertical: ms(10),
              }}
              onPress={() => {
                setReviewPDF(false)
                setIsPdfSigned(false)
              }}
            >
              <Text
                bold
                color={Colors.primary}
                fontSize={ms(12)}
                textAlign="right"
              >
                {t('done')}
              </Text>
            </TouchableOpacity>
          ) : (
            <Box
              style={{
                alignItems: 'flex-end',
                backgroundColor: Colors.black,
                paddingHorizontal: ms(16),
                paddingVertical: ms(10),
              }}
            >
              <Text
                bold
                color={Colors.primary}
                fontSize={ms(12)}
                textAlign="right"
              >
                {t('makeSingleTap')}
              </Text>
            </Box>
          )}
          {/* </HStack> */}

          <Pdf
            enablePaging
            source={source}
            style={styles.pdf}
            trustAllCerts={false}
            onError={error => {
              console.log(error)
            }}
            onLoadComplete={(numberOfPages, filePath, {width, height}) => {
              console.log(`Number of pages: ${numberOfPages}`)
              setPageWidth(width)
              setPageHeight(height)
            }}
            onPageChanged={(page, numberOfPages) => {
              console.log(`Current page: ${page}`)
            }}
            onPageSingleTap={(page, x, y) => {
              handleSingleTap(page, x, y)
            }}
            onPressLink={uri => {
              console.log(`Link pressed: ${uri}`)
            }}
          />
        </Modal.Content>
        {!signature && !isPdfSigned ? (
          <Modal.Footer bg={Colors.black}>
            <Box flex="1">
              <Button
                colorScheme="dark"
                mb={ms(8)}
                style={{borderColor: Colors.danger}}
                variant="outline"
                onPress={handleOnDecline}
              >
                {t('decline')}
              </Button>
              <Button bg={Colors.primary} onPress={handleOnAccept}>
                {t('accept')}
              </Button>
            </Box>
          </Modal.Footer>
        ) : null}
      </Modal>
    </Box>
  )
}

const styles = StyleSheet.create({
  pdf: {
    width: '100%',
    height: '100%',
    backgroundColor: '#23272F',
    paddingHorizontal: 12,
    marginBottom: Platform.OS === 'ios' ? 0 : 40,
  },
  bottom: {
    borderBottomEndRadius: 0,
    borderBottomStartRadius: 0,
    marginBottom: 0,
    marginTop: 'auto',
    maxHeight: '80%',
  },
})
