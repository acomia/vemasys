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
const RNFS = require('react-native-fs')

export default function Charters({navigation, route}: any) {
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

  const showToast = (text: string, res: string) => {
    toast.show({
      duration: 1000,
      render: () => {
        return (
          <Text
            bg={res === 'success' ? 'emerald.500' : 'red.500'}
            px="2"
            py="1"
            rounded="sm"
            mb={5}
            color={Colors.white}
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
          borderWidth={1}
          borderColor={status === 'completed' ? Colors.secondary : Colors.grey}
          borderRadius={ms(5)}
          mb={ms(10)}
          borderStyle={
            status === 'draft' || status === 'new' ? 'dashed' : 'solid'
          }
          overflow="hidden"
        >
          <HStack
            py={ms(8)}
            pl={ms(12)}
            pr={ms(10)}
            alignItems="center"
            justifyContent="space-between"
          >
            <VStack maxWidth="72%">
              <Text fontWeight="bold">
                {item.vesselReference || item.clientReference || 'Unknown'}
              </Text>
              {item.navigationLogs &&
                item.navigationLogs.map(
                  (navlog: {bulkCargo: any[]}) =>
                    navlog.bulkCargo &&
                    navlog.bulkCargo.map(cargo => {
                      if (cargo.isLoading) {
                        return (
                          <Text
                            key={cargo.id}
                            fontWeight="semibold"
                            color={
                              item.isActive || isLoaded(item.cargo)
                                ? '#29B7EF'
                                : Colors.disabled
                            }
                          >
                            {parseInt(cargo.amount) || 0} MT -{' '}
                            {cargo.type.nameEn || cargo.type.nameNl}
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
            <CharterStatus entityType={entityType} charter={item} />
          </HStack>
          <Box
            position="absolute"
            left={0}
            top={0}
            bottom={0}
            width={ms(7)}
            bg={status === 'completed' ? Colors.secondary : Colors.grey}
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
      const response = await getSignature(signatureId, navigateToGetSignatureScreen)
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
            path: `${path}_signed`
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
    <Box flex="1" safeArea backgroundColor={Colors.white} p={ms(12)}>
      <Input
        w={{
          base: '100%',
        }}
        backgroundColor="#F7F7F7"
        InputLeftElement={
          <Icon
            as={<MaterialIcons name="magnify" />}
            size={5}
            ml="2"
            color={Colors.disabled}
          />
        }
        placeholderTextColor={Colors.disabled}
        fontWeight="medium"
        placeholder="Search charter..."
        variant="filled"
        size="sm"
        value={searchedValue}
        onChangeText={e => onSearchCharter(e)}
      />
      <Divider my={ms(15)} />

      <FlatList
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
        renderItem={renderItem}
        keyExtractor={item => `Charter-${item.id}`}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={() => (
          <Text
            fontSize={ms(20)}
            fontWeight="bold"
            color={Colors.azure}
            mt={ms(20)}
            textAlign="center"
          >
            No Charters.
          </Text>
        )}
        refreshControl={
          <RefreshControl
            onRefresh={onPullToReload}
            refreshing={isCharterLoading}
          />
        }
      />
      <Modal
        isOpen={reviewPDF}
        size="full"
        animationPreset="slide"
        safeAreaTop={true}
        onClose={() => setReviewPDF(false)}
      >
        <Modal.Content style={styles.bottom} bg="#23272F">
          {/* <HStack bg={Colors.black} py={ms(10)} px={ms(16)}>
            <Text
              flex="1"
              textAlign="center"
              color={Colors.white}
              fontSize={ms(12)}
              fontWeight="bold"
            >
              {path?.replace(
                '/data/user/0/com.vemasysreactnativeapp/files/ReactNativeBlobUtilTmp_',
                ''
              )}
              .pdf
            </Text> */}
          {!signature ? (
            <TouchableOpacity
              onPress={() => {
                setReviewPDF(false)
                setIsPdfSigned(false)
              }}
              style={{
                alignItems: 'flex-end',
                backgroundColor: Colors.black,
                paddingHorizontal: ms(16),
                paddingVertical: ms(10),
              }}
            >
              <Text
                color={Colors.primary}
                fontSize={ms(12)}
                fontWeight="bold"
                textAlign="right"
              >
                Done
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
                color={Colors.primary}
                fontSize={ms(12)}
                fontWeight="bold"
                textAlign="right"
              >
                Make single tap to select place for signature
              </Text>
            </Box>
          )}
          {/* </HStack> */}

          <Pdf
            source={source}
            onLoadComplete={(numberOfPages, filePath, {width, height}) => {
              console.log(`Number of pages: ${numberOfPages}`)
              setPageWidth(width)
              setPageHeight(height)
            }}
            onPageChanged={(page, numberOfPages) => {
              console.log(`Current page: ${page}`)
            }}
            onError={error => {
              console.log(error)
            }}
            onPressLink={uri => {
              console.log(`Link pressed: ${uri}`)
            }}
            style={styles.pdf}
            enablePaging
            trustAllCerts={false}
            onPageSingleTap={(page, x, y) => {
              handleSingleTap(page, x, y)
            }}
          />
        </Modal.Content>
        {!signature && !isPdfSigned ? (
          <Modal.Footer bg={Colors.black}>
            <Box flex="1">
              <Button
                variant="outline"
                colorScheme="dark"
                style={{borderColor: Colors.danger}}
                mb={ms(8)}
                onPress={handleOnDecline}
              >
                Decline
              </Button>
              <Button bg={Colors.primary} onPress={handleOnAccept}>
                Accept
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
