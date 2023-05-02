/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-native/no-inline-styles */
import React, {useEffect, useState} from 'react'
import {
  Box,
  Divider,
  HStack,
  Modal,
  ScrollView,
  Skeleton,
  Text,
  useToast,
} from 'native-base'
import ReactNativeBlobUtil from 'react-native-blob-util'
import {
  incomingStatuses,
  outgoingStatuses,
  VEMASYS_PRODUCTION_FILE_URL,
} from '@bluecentury/constants'
import {Dimensions, Platform, TouchableOpacity} from 'react-native'
import Pdf from 'react-native-pdf'
import {Colors} from '@bluecentury/styles'
import moment from 'moment'
import {NativeStackScreenProps} from '@react-navigation/native-stack'
import {useFinancial} from '@bluecentury/stores'
import {ms} from 'react-native-size-matters'
import {useTranslation} from 'react-i18next'
import {NoInternetConnectionMessage} from '@bluecentury/components'
import {InvoiceStatus} from '@bluecentury/models'
import {RootStackParamList} from '@bluecentury/types/nav.types'

interface IInvoiceCardTotal {
  label: string
  value: string
}

type Props = NativeStackScreenProps<
  RootStackParamList,
  'FinancialInvoiceDetails'
>
const FinancialInvoiceDetails = ({route}: Props) => {
  const {t} = useTranslation()
  const toast = useToast()
  const {id, routeFrom} = route.params
  const {
    isFinancialLoading,
    invoiceDetails,
    getInvoiceDetails,
    updateInvoiceStatus,
  } = useFinancial()
  const [statusModal, setStatusModal] = useState(false)
  const [dateToggled, setdateToggled] = useState(false)
  const statuses = routeFrom === 'costs' ? incomingStatuses : outgoingStatuses

  useEffect(() => {
    getInvoiceDetails(id)
  }, [])

  let filePath = ''
  if (invoiceDetails?.file !== null) {
    filePath = invoiceDetails?.file?.path.startsWith(
      ReactNativeBlobUtil.fs.dirs.DocumentDir
    )
      ? invoiceDetails?.file?.path
      : `${VEMASYS_PRODUCTION_FILE_URL}/${invoiceDetails?.file?.path}`
  }
  const source = {uri: filePath, cache: true, expiration: 3600 * 24 * 30}

  const statusBgColor = (status: InvoiceStatus | string) => {
    switch (status) {
      case 'paid':
        return Colors.secondary
      case 'draft':
        return Colors.primary
      case 'read':
        return Colors.disabled
      case 'accepted':
        return Colors.azure
      case 'stored':
        return Colors.azure
      case 'pending':
        return Colors.warning
      case 'sent':
        return Colors.warning
      case 'unpaid':
        return Colors.danger
      case 'new':
        return Colors.highlighted_text
      case 'payment_confirmed':
        return Colors.highlighted_text
      default:
        return Colors.primary
    }
  }

  const statusLabel = (status: InvoiceStatus | string) => {
    if (typeof status === 'object') return t(status?.code)
    else return t(status)
  }

  const CardContent = ({label, value}: IInvoiceCardTotal) => {
    return (
      <HStack
        alignItems="center"
        bg={Colors.white}
        borderColor="#E6E6E6"
        borderRadius={ms(5)}
        borderWidth={1}
        h={ms(55)}
        justifyContent="space-between"
        mb={ms(10)}
        overflow="hidden"
        px={ms(15)}
        shadow={1}
      >
        <Text color={Colors.text} flex="1" fontWeight="medium">
          {label}
        </Text>
        <Box
          borderColor="#E6E6E6"
          borderLeftWidth={ms(1)}
          flex="1"
          height="100%"
          justifyContent="center"
        >
          <Skeleton
            h="25"
            isLoaded={!isFinancialLoading}
            ml={ms(10)}
            rounded="md"
            startColor={Colors.light}
          >
            {label === 'Status' ? (
              <TouchableOpacity onPress={() => setStatusModal(true)}>
                <Box
                  alignItems="center"
                  bg={statusBgColor(value)}
                  borderRadius={ms(15)}
                  ml={ms(15)}
                  px={ms(10)}
                  py={ms(3)}
                >
                  <Text
                    color={Colors.white}
                    fontWeight="medium"
                    textAlign="center"
                  >
                    {statusLabel(value)}
                  </Text>
                </Box>
              </TouchableOpacity>
            ) : (
              <Text
                color={Colors.azure}
                fontWeight="medium"
                ml={ms(15)}
                textAlign="left"
              >
                {value}
              </Text>
            )}
          </Skeleton>
        </Box>
      </HStack>
    )
  }

  const CardTotal = ({label, value}: IInvoiceCardTotal) => {
    return (
      <HStack
        alignItems="center"
        bg={Colors.highlighted_text}
        borderColor="#E6E6E6"
        borderRadius={ms(5)}
        borderWidth={1}
        h={ms(60)}
        justifyContent="space-between"
        mb={ms(10)}
        overflow="hidden"
        px={ms(15)}
        shadow={1}
      >
        <Text color={Colors.white} flex="1" fontWeight="medium">
          {label}
        </Text>
        <Box
          borderColor="#E6E6E6"
          borderLeftWidth={ms(1)}
          flex="1"
          height="100%"
          justifyContent="center"
        >
          <Skeleton
            h="25"
            isLoaded={!isFinancialLoading}
            ml={ms(10)}
            rounded="md"
            startColor={Colors.light}
          >
            <Text
              bold
              color={Colors.white}
              fontSize={ms(18)}
              ml={ms(15)}
              textAlign="left"
            >
              €{' '}
              {Platform.OS === 'ios'
                ? Number(value).toLocaleString('en-GB', {
                    maximumFractionDigits: 2,
                    minimumFractionDigits: 2,
                  })
                : Number(value)
                    .toFixed(2)
                    .replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')}
            </Text>
          </Skeleton>
        </Box>
      </HStack>
    )
  }

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

  const onUpdateInvoiceStatus = async (status: string) => {
    setStatusModal(false)
    let res

    if (routeFrom === 'costs') {
      res = await updateInvoiceStatus(
        invoiceDetails?.id.toString(),
        status,
        invoiceDetails?.outgoingStatus
      )
    } else {
      res = await updateInvoiceStatus(
        invoiceDetails?.id.toString(),
        invoiceDetails?.status.code,
        status
      )
    }

    if (typeof res === 'object' && res?.id) {
      getInvoiceDetails(id)
      showToast('Status updated.', 'success')
    } else {
      showToast('Status update failed.', 'failed')
    }
  }

  return (
    <Box
      bg={Colors.white}
      borderTopLeftRadius={ms(15)}
      borderTopRightRadius={ms(15)}
      flex="1"
    >
      <NoInternetConnectionMessage />
      <ScrollView contentContainerStyle={{flexGrow: 1}}>
        <Box px={ms(14)} py={ms(20)}>
          <CardContent
            value={
              routeFrom === 'costs'
                ? invoiceDetails?.receiverReference
                : invoiceDetails?.senderReference
            }
            label={t('invoiceNumber')}
          />
          <CardContent
            label={t('receiver')}
            value={invoiceDetails?.receiver?.alias}
          />
          <CardContent
            label={t('reference')}
            value={invoiceDetails?.senderReference}
          />
          <CardContent
            value={
              routeFrom === 'costs'
                ? invoiceDetails?.status?.code
                : invoiceDetails?.outgoingStatus
            }
            label={t('status')}
          />
          <TouchableOpacity onPress={() => setdateToggled(!dateToggled)}>
            {dateToggled && (
              <CardContent
                value={
                  invoiceDetails?.sentAt === null
                    ? ''
                    : moment(invoiceDetails?.sentAt).format('DD MMM YYYY')
                }
                label={t('sentOn')}
              />
            )}
            <CardContent
              value={
                invoiceDetails?.dueDate === null
                  ? ''
                  : moment(invoiceDetails?.dueDate).format('DD MMM YYYY')
              }
              label={t('dueDate')}
            />
          </TouchableOpacity>
          <CardTotal
            label={t('totalExclVAT')}
            value={invoiceDetails?.totalAmount}
          />
        </Box>
        {filePath !== '' ? (
          <Pdf
            enablePaging
            style={{
              marginTop: -50,
              backgroundColor: 'transparent',
              width: Dimensions.get('window').width,
              height: Dimensions.get('window').height,
            }}
            source={source}
            trustAllCerts={false}
          />
        ) : (
          <Box alignItems="center" flex="1">
            <Text
              style={{fontSize: 16, fontWeight: '700', color: Colors.azure}}
            >
              {t('noAvailableFile')}
            </Text>
          </Box>
        )}
      </ScrollView>

      <Modal
        animationPreset="slide"
        isOpen={statusModal}
        size="full"
        onClose={() => setStatusModal(false)}
      >
        <Modal.Content mb={0} mt="auto" px={ms(10)}>
          <Modal.CloseButton />
          <Modal.Header>{t('updateStatus')}</Modal.Header>
          <Modal.Body>
            {statuses.map((status, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => onUpdateInvoiceStatus(status.value)}
              >
                <Text color={Colors.text} fontSize={ms(15)} fontWeight="medium">
                  {t(status.label)}
                </Text>
                <Divider my={ms(10)} />
              </TouchableOpacity>
            ))}
          </Modal.Body>
        </Modal.Content>
      </Modal>
    </Box>
  )
}

export default FinancialInvoiceDetails
