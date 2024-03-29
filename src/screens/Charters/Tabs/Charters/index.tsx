/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-native/no-inline-styles */
import React, {useEffect, useRef, useState} from 'react'
import {
  RefreshControl,
  StyleSheet,
  TouchableOpacity,
  Platform,
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
  Modal,
  Button,
  useToast,
  Image,
  Switch,
} from 'native-base'
import {ms} from 'react-native-size-matters'
import moment from 'moment'
import MaterialIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import Pdf from 'react-native-pdf'
import {PDFDocument} from 'pdf-lib'
import {decode as atob, encode as btoa} from 'base-64'
import ReactNativeBlobUtil from 'react-native-blob-util'
import {useTranslation} from 'react-i18next'
import Signature, {SignatureViewRef} from 'react-native-signature-canvas'
import {sortBy} from 'lodash'

import {useCharters, useEntity, useSettings} from '@bluecentury/stores'
import {Colors} from '@bluecentury/styles'
import {
  CharterStatus,
  LoadingAnimated,
  EditReferenceModal,
} from '@bluecentury/components'
import {Animated, Icons} from '@bluecentury/assets'
import {
  CHARTER_CONTRACTOR_STATUS_ACCEPTED,
  CHARTER_CONTRACTOR_STATUS_REFUSED,
} from '@bluecentury/constants'

type SignatureLocation = {
  width?: number
  height?: number
  x?: number
  y?: number
  page?: number
}

export default function Charters({navigation, route}: any) {
  const {t} = useTranslation()
  const toast = useToast()
  const {
    isCharterLoading,
    charters,
    timeCharters,
    getCharters,
    viewPdf,
    updateCharterStatus,
    addSignedDocument,
    setSignatureId,
    updateCharterStatusResponse,
    setIsDocumentSigning,
    isDocumentSigning,
    uploadSignedPDF,
    linkSignPDFToCharter,
  } = useCharters()
  const {entityId, vesselId} = useEntity()
  const {isMobileTracking} = useSettings()
  const [searchedValue, setSearchValue] = useState('')
  const [chartersData, setChartersData] = useState(
    route === 'charters' ? charters : timeCharters
  )
  const [path, setPath] = useState<string>('')
  const [selectedCharter, setSelectedCharter] = useState(null)
  const [signature, setSignature] = useState('')
  const [pdfArrayBuffer, setPdfArrayBuffer] = useState<ArrayBuffer | null>(null)
  const [isSignaturePlaceChoiceOpen, setIsSignaturePlaceChoiceOpen] =
    useState(false)
  const [isCharterAccepted, setIsCharterAccepted] = useState(false)
  const [isSignatureSampleOpen, setIsSignatureSampleOpen] = useState(false)
  const [signatureLocation, setSignatureLocation] = useState<SignatureLocation>(
    {}
  )
  const [isPdfSigned, setIsPdfSigned] = useState(false)
  const source = {uri: path, cache: true}
  const [editReferenceOpen, setEditReferenceOpen] = useState(false)
  const [editCharter, setEditCharter] = useState(0)
  const [isPdfSaving, setIsPdfSaving] = useState(false)
  const ref = useRef<SignatureViewRef>(null)

  const style = `.m-signature-pad--footer {display: none; margin: 0px;}
                .m-signature-pad {border-radius: 10px; border: 1px solid #E6E6E6;}
                body {height: 60%; margin-top: 70%; background: #00000059; padding-left: 12px; padding-right: 12px;}
               `

  const handleOnValueChange = () => {
    navigation.navigate('TrackingServiceDialog')
  }

  const handleEmpty = () => {
    showToast('Please sign before accepting.', 'warning')
  }

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

  useEffect(() => {
    if (signature) {
      handleSingleTap()
    }
  }, [signature])

  const uploadSignedDocument = async (pathToSignedFile: string) => {
    const uploadResponse = await uploadSignedPDF({
      uri: pathToSignedFile,
      type: 'application/pdf',
      fileName: 'Signed_agreement.pdf',
    })
    if (uploadResponse) {
      await linkSignPDFToCharter(
        uploadResponse.path,
        'Signed_document',
        selectedCharter?.id
      )
    }
  }

  const readFile = () => {
    ReactNativeBlobUtil.fs.readFile(path, 'base64').then(contents => {
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

  const renderItem = ({item, index}: any) => {
    const charterCreator =
      item.charterContracts[0].contract.contractParties.find(
        entity => entity.creator
      )
    const isCreator = charterCreator.entity.id === entityId
    // const status = getCharterStatus(item, entityType)
    return (
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={() => onCharterSelected(item, isCreator)}
      >
        <Box
          key={index}
          borderColor={
            item.status === 'completed'
              ? Colors.secondary
              : index === 1 && item.status === 'accepted'
              ? Colors.primary_light
              : Colors.grey
          }
          borderStyle={
            item.status === 'draft' || item.status === 'new'
              ? 'dashed'
              : 'solid'
          }
          borderWidth={
            index === 1 ||
            item.status === 'accepted' ||
            item.status === 'draft' ||
            item.status === 'new'
              ? 2
              : 1
          }
          borderRadius={ms(5)}
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
            <VStack flex="1">
              {renderRefNumber(item)}
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
            <CharterStatus charter={item} isCreator={isCreator} />
          </HStack>
          <Box
            bg={item.status === 'completed' ? Colors.secondary : Colors.grey}
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

  const renderRefNumber = (itemData: any) => {
    if (!itemData?.customerReference && !itemData?.supplierReference) {
      return (
        <Text bold>
          {itemData?.clientReference || itemData?.vesselReference}
        </Text>
      )
    }
    return (
      <HStack space={ms(5)}>
        <Text bold>{itemData?.customerReference}</Text>
        {itemData?.customerReference && itemData?.supplierReference && (
          <Divider mx={ms(5)} orientation="vertical" />
        )}
        <Text bold>{itemData?.supplierReference}</Text>
      </HStack>
    )
  }

  const onSearchCharter = (value: string) => {
    setSearchValue(value)
    const chartersTemp = route === 'charters' ? charters : timeCharters
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

  const onCharterSelected = async (charter: any, isCreator: boolean) => {
    setSelectedCharter(charter)
    if (charter.contractorStatus === 'new' && !isCreator) {
      const pathToFile = await viewPdf(charter.id)
      setPath(pathToFile)
      setIsSignaturePlaceChoiceOpen(true)
    } else {
      navigation.navigate('CharterDetails', {
        charter: charter,
        isCreator: isCreator,
      })
    }
  }

  const handleOnDecline = async () => {
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

  const handleOnAcceptAndSign = () => {
    ref.current?.readSignature()
  }

  const handleClear = () => {
    ref.current?.clearSignature()
  }

  const onPullToReload = () => {
    getCharters()
  }

  const _base64ToArrayBuffer = (base64: string) => {
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

  const handleSingleTap = async () => {
    if (signature) {
      setIsDocumentSigning(true)
      setIsSignatureSampleOpen(false)
      setIsSignaturePlaceChoiceOpen(false)
      const signArrBuf = _base64ToArrayBuffer(
        signature.replace('data:image/png;base64,', '')
      )
      const pdfDoc = await PDFDocument.load(pdfArrayBuffer)
      const pages = pdfDoc.getPages()
      const firstPage = pages[0]

      const signatureImage = await pdfDoc.embedPng(signArrBuf)
      if (Platform.OS === 'ios') {
        firstPage.drawImage(signatureImage, {
          // x:
          //   (signatureLocation.width * (signatureLocation.x - 12)) /
          //   Dimensions.get('window').width,
          // y:
          //   signatureLocation.height -
          //   (signatureLocation.height * (signatureLocation.y + 12)) / 540,
          x: 20,
          y: 20,
          width: 100,
          height: 100,
        })
      } else {
        firstPage.drawImage(signatureImage, {
          // x:
          //   (firstPage.getWidth() * signatureLocation.x) /
          //   signatureLocation.width,
          // y:
          //   firstPage.getHeight() -
          //   (firstPage.getHeight() * signatureLocation.y) /
          //     signatureLocation.height -
          //   25,
          x: 20,
          y: 20,
          width: 100,
          height: 100,
        })
      }

      const pdfBytes = await pdfDoc.save()
      const pdfBase64 = _uint8ToBase64(pdfBytes)

      await ReactNativeBlobUtil.fs
        .writeFile(`${path}_signed`, pdfBase64, 'base64')
        .then(async success => {
          console.log('SIGNATURE_SUCCESS_NEW_PATH', success)
          setPath(`${path}_signed`)
          setIsPdfSigned(true)
        })
        .catch(err => {
          console.log(err.message)
        })
      setSignature('')
      setIsDocumentSigning(false)
    }
  }

  const resetState = () => {
    setPath('')
    setSelectedCharter(null)
    setSignature('')
    setPdfArrayBuffer(null)
    setIsSignaturePlaceChoiceOpen(false)
    setIsCharterAccepted(false)
    setIsSignatureSampleOpen(false)
    setSignatureLocation({})
    setIsPdfSigned(false)
  }

  const handleSaveDocument = async () => {
    setIsPdfSaving(true)
    setIsPdfSigned(false)
    const status = {
      status: CHARTER_CONTRACTOR_STATUS_ACCEPTED,
      setContractorStatus: true,
    }
    const update = await updateCharterStatus(selectedCharter?.id, status)
    const upload = await uploadSignedDocument(path)

    Promise.all([update, upload]).then(async () => {
      try {
        await getCharters()
        resetState()
        showToast('Charter accepted sucessfully.', 'success')
      } catch (e) {
        console.log('HANDLE_SAVE_DOCUMENT_ERROR', e)
        showToast('Charter accepted failed.', 'failed')
      }
    })
    setIsPdfSaving(false)
  }

  const handleDiscard = () => {
    resetState()
  }

  const getSortedData = () => {
    const first =
      route === 'charters'
        ? charters.filter(c => c?.status === 'new')
        : timeCharters.filter(c => c?.status === 'new')

    const rest =
      route === 'charters'
        ? charters.filter(c => c?.status !== 'new')
        : timeCharters.filter(c => c?.status !== 'new')

    const chrs = [...first, ...sortBy(rest, 'status')]

    return chrs
  }

  if (isCharterLoading || isPdfSaving) return <LoadingAnimated />

  if (isDocumentSigning) {
    return (
      <Image
        style={{
          width: '100%',
          height: '100%',
          alignSelf: 'center',
        }}
        alt="Charter-Signature"
        resizeMode="cover"
        source={Animated.signature}
      />
    )
  }

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
        refreshControl={
          <RefreshControl
            refreshing={isCharterLoading}
            onRefresh={onPullToReload}
          />
        }
        data={searchedValue !== '' ? chartersData : getSortedData()}
        keyExtractor={item => `Charter-${item.id}`}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
      />

      <Modal
        animationPreset="slide"
        isOpen={isSignaturePlaceChoiceOpen || isPdfSigned}
        safeAreaTop={true}
        size="full"
        onClose={() => setIsSignaturePlaceChoiceOpen(false)}
      >
        <Modal.Content bg="#23272F" style={styles.bottom}>
          <Box
            style={{
              alignItems: 'center',
              backgroundColor: Colors.black,
              paddingHorizontal: ms(16),
              paddingVertical: ms(10),
            }}
          >
            <Text
              bold
              color={Colors.primary}
              fontSize={ms(12)}
              textAlign="center"
            >
              Document.pdf
            </Text>
          </Box>
          <Pdf
            enablePaging
            source={isPdfSigned ? {uri: path, cache: true} : source}
            style={styles.pdf}
            trustAllCerts={false}
            onError={error => {
              console.log(error)
            }}
            onLoadComplete={(numberOfPages, filePath, {width, height}) => {
              console.log(`HEIGHT: ${height}`, `WIDTH: ${width}`)
              setSignatureLocation({
                ...signatureLocation,
                height,
                width,
              })
            }}
            onPageChanged={page => {
              console.log(`Current page: ${page}`)
            }}
            onPageSingleTap={(page, x, y) => {
              console.log('X:', x, 'Y:', y)
              isCharterAccepted
                ? (setSignatureLocation({
                    ...signatureLocation,
                    x,
                    y,
                    page,
                  }),
                  setIsSignatureSampleOpen(true))
                : null
            }}
            onPressLink={uri => {
              console.log(`Link pressed: ${uri}`)
            }}
          />
        </Modal.Content>
        {!isCharterAccepted ? (
          <Modal.Footer bg={Colors.black}>
            <Box flex="1">
              <Button
                colorScheme="dark"
                mb={ms(8)}
                style={{borderColor: Colors.danger}}
                variant="outline"
                onPress={() => {
                  setIsSignaturePlaceChoiceOpen(false)
                  handleOnDecline()
                }}
              >
                {t('decline')}
              </Button>
              <Button
                bg={Colors.primary}
                // onPress={() => setIsCharterAccepted(true)}
                onPress={() => {
                  setIsSignatureSampleOpen(true)
                  setIsCharterAccepted(true)
                }}
              >
                {t('accept')}
              </Button>
            </Box>
          </Modal.Footer>
        ) : (
          <Modal.Footer bg={Colors.black}>
            <Box flex="1">
              <Button
                colorScheme="dark"
                mb={ms(8)}
                style={{borderColor: Colors.danger}}
                variant="outline"
                onPress={handleDiscard}
              >
                Discard
              </Button>
              <Button bg={Colors.primary} onPress={handleSaveDocument}>
                Save
              </Button>
            </Box>
          </Modal.Footer>
        )}
      </Modal>
      <Modal
        style={{
          height: '100%',
          alignSelf: 'flex-end',
          backgroundColor: Colors.white,
        }}
        animationPreset="slide"
        bgColor="#00000059"
        isOpen={isSignatureSampleOpen}
        safeAreaTop={false}
        size="full"
        onClose={() => setIsSignatureSampleOpen(false)}
      >
        <Box bg={Colors.black} h="100%" w="100%">
          <Signature
            ref={ref}
            webStyle={style}
            onEmpty={handleEmpty}
            onOK={sign => setSignature(sign)}
          />
          <Box bg={Colors.white}>
            <HStack
              alignItems="center"
              borderColor={Colors.light}
              borderRadius={5}
              borderWidth={1}
              justifyContent="space-between"
              mt={ms(12)}
              mx={ms(12)}
              px={ms(12)}
              py={ms(7)}
            >
              <Image
                alt="my-location"
                height={ms(20)}
                mr={ms(10)}
                source={Icons.location_alt}
                width={ms(20)}
              />
              <Text flex={1} fontWeight="medium">
                {t('activateTracking')}
              </Text>
              <Switch
                size="sm"
                value={isMobileTracking}
                onToggle={handleOnValueChange}
              />
            </HStack>
            <HStack bg={Colors.white} p={ms(14)}>
              <Button
                colorScheme="muted"
                flex="1"
                variant="ghost"
                onPress={handleClear}
              >
                {t('clear')}
              </Button>
              <Button
                bg={Colors.primary}
                flex="1"
                onPress={handleOnAcceptAndSign}
              >
                {t('acceptAndSign')}
              </Button>
            </HStack>
          </Box>
        </Box>
      </Modal>
      <EditReferenceModal
        charter={editCharter}
        isOpen={editReferenceOpen}
        setOpen={() => setEditReferenceOpen(false)}
      />
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
