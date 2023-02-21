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

type Props = NativeStackScreenProps<RootStackParamList>
const FinancialInvoiceDetails = ({navigation, route}: Props) => {
  const {t} = useTranslation()
  const toast = useToast()
  const {id, routeFrom}: any = route.params
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

  const statusBgColor = (status: string) => {
    switch (status) {
      case 'paid':
        return Colors.secondary
      case 'draft':
        return Colors.secondary
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

  const statusLabel = (status: string) => {
    // switch (status) {
    //   case 'paid':
    //     return 'Paid'
    //   case 'draft':
    //     return 'Draft'
    //   case 'read':
    //     return 'Read'
    //   case 'accepted':
    //     return 'Accepted'
    //   case 'stored':
    //     return 'Stored'
    //   case 'pending':
    //     return 'Pending'
    //   case 'sent':
    //     return 'Sent'
    //   case 'unpaid':
    //     return 'Unpaid'
    //   case 'new':
    //     return 'New'
    //   case 'payment_confirmed':
    //     return 'Payment confirmed'
    //   default:
    //     return ' '
    // }
    return t(status)
  }

  const CardContent = ({label, value}: any) => {
    return (
      <HStack
        overflow="hidden"
        justifyContent="space-between"
        alignItems="center"
        bg={Colors.white}
        borderRadius={ms(5)}
        borderWidth={1}
        borderColor="#E6E6E6"
        h={ms(55)}
        mb={ms(10)}
        shadow={1}
        px={ms(15)}
      >
        <Text flex="1" fontWeight="medium" color={Colors.text}>
          {label}
        </Text>
        <Box
          flex="1"
          borderLeftWidth={ms(1)}
          borderColor="#E6E6E6"
          height="100%"
          justifyContent="center"
        >
          <Skeleton
            h="25"
            ml={ms(10)}
            rounded="md"
            startColor={Colors.light}
            isLoaded={!isFinancialLoading}
          >
            {label === 'Status' ? (
              <TouchableOpacity onPress={() => setStatusModal(true)}>
                <Box
                  borderRadius={ms(15)}
                  px={ms(10)}
                  py={ms(3)}
                  alignItems="center"
                  bg={statusBgColor(value)}
                  ml={ms(15)}
                >
                  <Text
                    fontWeight="medium"
                    textAlign="center"
                    color={Colors.white}
                  >
                    {statusLabel(value)}
                  </Text>
                </Box>
              </TouchableOpacity>
            ) : (
              <Text
                fontWeight="medium"
                textAlign="left"
                color={Colors.azure}
                ml={ms(15)}
              >
                {value}
              </Text>
            )}
          </Skeleton>
        </Box>
      </HStack>
    )
  }

  const CardTotal = ({label, value}) => {
    return (
      <HStack
        overflow="hidden"
        justifyContent="space-between"
        alignItems="center"
        bg={Colors.highlighted_text}
        borderRadius={ms(5)}
        borderWidth={1}
        borderColor="#E6E6E6"
        h={ms(60)}
        mb={ms(10)}
        shadow={1}
        px={ms(15)}
      >
        <Text flex="1" fontWeight="medium" color={Colors.white}>
          {label}
        </Text>
        <Box
          flex="1"
          borderLeftWidth={ms(1)}
          borderColor="#E6E6E6"
          height="100%"
          justifyContent="center"
        >
          <Skeleton
            h="25"
            ml={ms(10)}
            rounded="md"
            startColor={Colors.light}
            isLoaded={!isFinancialLoading}
          >
            <Text
              fontSize={ms(18)}
              bold
              textAlign="left"
              color={Colors.white}
              ml={ms(15)}
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

  const onUpdateInvoiceStatus = async (status: string) => {
    setStatusModal(false)
    let res
    if (routeFrom === 'costs') {
      res = await updateInvoiceStatus(
        invoiceDetails?.id,
        status,
        invoiceDetails?.outgoingStatus
      )
    } else {
      res = await updateInvoiceStatus(
        invoiceDetails?.id,
        invoiceDetails?.status,
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
      flex="1"
      borderTopLeftRadius={ms(15)}
      borderTopRightRadius={ms(15)}
      bg={Colors.white}
    >
      <NoInternetConnectionMessage />
      <ScrollView contentContainerStyle={{flexGrow: 1}}>
        <Box px={ms(14)} py={ms(20)}>
          <CardContent
            label={t('invoiceNumber')}
            value={
              routeFrom === 'costs'
                ? invoiceDetails?.receiverReference
                : invoiceDetails?.senderReference
            }
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
            label={t('status')}
            value={
              routeFrom === 'costs'
                ? invoiceDetails?.status
                : invoiceDetails?.outgoingStatus
            }
          />
          <TouchableOpacity onPress={() => setdateToggled(!dateToggled)}>
            {dateToggled && (
              <CardContent
                label={t('sentOn')}
                value={
                  invoiceDetails?.sentAt === null
                    ? ''
                    : moment(invoiceDetails?.sentAt).format('DD MMM YYYY')
                }
              />
            )}
            <CardContent
              label={t('dueDate')}
              value={
                invoiceDetails?.dueDate === null
                  ? ''
                  : moment(invoiceDetails?.dueDate).format('DD MMM YYYY')
              }
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
            source={source}
            style={{
              marginTop: -50,
              backgroundColor: 'transparent',
              width: Dimensions.get('window').width,
              height: Dimensions.get('window').height,
            }}
            trustAllCerts={false}
          />
        ) : (
          <Box flex="1" alignItems="center">
            <Text
              style={{fontSize: 16, fontWeight: '700', color: Colors.azure}}
            >
              {t('noAvailableFile')}
            </Text>
          </Box>
        )}
      </ScrollView>

      <Modal
        isOpen={statusModal}
        animationPreset="slide"
        size="full"
        onClose={() => setStatusModal(false)}
      >
        <Modal.Content px={ms(10)} mb={0} mt="auto">
          <Modal.CloseButton />
          <Modal.Header>{t('updateStatus')}</Modal.Header>
          <Modal.Body>
            {statuses.map((status, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => onUpdateInvoiceStatus(status.value)}
              >
                <Text fontSize={ms(15)} fontWeight="medium" color={Colors.text}>
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
