/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable prefer-spread */
import React, {useEffect, useState} from 'react'
import {Platform, RefreshControl, TouchableOpacity} from 'react-native'
import {Box, FlatList, HStack, Select, Skeleton, Text} from 'native-base'
import {Shadow} from 'react-native-shadow-2'
import moment from 'moment'
import {ms} from 'react-native-size-matters'

import {Colors} from '@bluecentury/styles'
import {useEntity, useFinancial} from '@bluecentury/stores'
import {NavigationProp, useNavigation} from '@react-navigation/native'
import {LoadingAnimated} from '@bluecentury/components'
import {useSafeAreaInsets} from 'react-native-safe-area-context'
import {useTranslation} from 'react-i18next'
import {RootStackParamList} from '@bluecentury/types/nav.types'
import {Invoice} from '@bluecentury/models'

interface IInvoiceCard {
  invoice: string
  invoice_date: Date
  amount: string
  status: string
}

interface IInvoiceCardTotal {
  label: string
  value: number
}

const Revenue = () => {
  const {t} = useTranslation()
  const insets = useSafeAreaInsets()
  const navigation = useNavigation<NavigationProp<RootStackParamList>>()
  const {isFinancialLoading, invoiceStatistics, outgoingInvoices, getInvoices} =
    useFinancial()
  const {vesselId} = useEntity()
  const [selectedYear, setSelectedYear] = useState(
    new Date().getFullYear().toString()
  )
  const [totalEnabled, setTotalEnabled] = useState(false)
  const [page, setPage] = useState(1)
  const [isPageChange, setIsPageChange] = useState(false)

  useEffect(() => {
    getInvoices('Outgoing', selectedYear, page)
  }, [page, vesselId])

  useEffect(() => {
    setIsPageChange(false)
  }, [outgoingInvoices])

  const handleFilterByYear = (e: string) => {
    setSelectedYear(e)
    getInvoices('Outgoing', e, 1)
    setPage(1)
  }

  const loadNextPage = () => {
    setIsPageChange(true)
    setPage(page + 1)
  }

  const statusBgColor = (status: string) => {
    switch (status) {
      case 'paid':
        return Colors.secondary
      case 'read':
        return Colors.disabled
      case 'stored':
        return Colors.azure
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
    return t(status)
  }

  const Card = ({invoice, invoice_date, amount, status}: IInvoiceCard) => {
    return (
      <HStack
        alignItems="center"
        bg={Colors.white}
        borderColor={Colors.light}
        borderRadius={ms(5)}
        borderWidth={1}
        justifyContent="space-between"
        mb={ms(10)}
        overflow="hidden"
        px={ms(15)}
        py={ms(5)}
        shadow={1}
      >
        <Box alignItems="flex-start">
          <Text color={Colors.text} fontWeight="medium">
            {invoice}
          </Text>
          <Text color={Colors.disabled}>
            {moment(invoice_date).format('DD MMM YYYY')}
          </Text>
        </Box>
        <Box alignItems="flex-end">
          <Text color={Colors.danger}>
            €{' '}
            {Platform.OS === 'ios'
              ? Number(amount).toLocaleString('en-GB', {
                  maximumFractionDigits: 2,
                  minimumFractionDigits: 2,
                })
              : Number(amount)
                  .toFixed(2)
                  .replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')}
          </Text>
          <Box
            alignItems="center"
            bg={statusBgColor(status)}
            borderRadius={15}
            justifyContent="center"
            px={ms(15)}
          >
            <Text bold color={Colors.white} fontSize={ms(12)}>
              {statusLabel(status)}
            </Text>
          </Box>
        </Box>
      </HStack>
    )
  }

  const CardTotal = ({label, value}: IInvoiceCardTotal) => {
    return (
      <TouchableOpacity
        activeOpacity={0.8}
        style={{padding: 12}}
        onPress={() => setTotalEnabled(!totalEnabled)}
      >
        <HStack
          alignItems="center"
          bg={Colors.secondary}
          borderColor={Colors.light}
          borderRadius={5}
          borderWidth={1}
          height={ms(48)}
          justifyContent="space-between"
          px={ms(16)}
          width="100%"
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
                textAlign="right"
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
      </TouchableOpacity>
    )
  }

  const CardTotalDetails = ({label, value}: IInvoiceCardTotal) => {
    return (
      <HStack
        alignItems="center"
        bg={Colors.secondary}
        borderColor={Colors.light}
        borderRadius={5}
        borderWidth={1}
        height={ms(48)}
        justifyContent="space-between"
        px={ms(16)}
        width="100%"
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
            <Text bold color={Colors.white} fontSize={ms(18)} textAlign="right">
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

  const onPullToReload = () => {
    getInvoices('Outgoing', selectedYear, 1)
    setPage(1)
  }

  return (
    <Box flex="1">
      <Box flex="1">
        <Box px={ms(15)} py={ms(25)}>
          <Select
            accessibilityLabel=""
            bg={Colors.azure}
            color={Colors.white}
            fontSize={ms(16)}
            fontWeight="medium"
            minWidth="300"
            selectedValue={selectedYear}
            onValueChange={val => handleFilterByYear(val)}
          >
            {Array.apply(null, {length: 5}).map((e, i) => {
              const year = new Date().getFullYear() - i
              return <Select.Item key={i} label={`${year}`} value={`${year}`} />
            })}
          </Select>
        </Box>
        <Box bg={Colors.white} flex="1" px={ms(15)} py={ms(25)}>
          <Text bold color={Colors.azure} fontSize={ms(20)} mb={ms(20)}>
            {t('outgoingInvoices')}
          </Text>
          {isFinancialLoading && !isPageChange ? (
            <LoadingAnimated />
          ) : (
            <FlatList<Invoice>
              refreshControl={
                <RefreshControl
                  refreshing={isFinancialLoading}
                  onRefresh={onPullToReload}
                />
              }
              renderItem={({item, index}) => (
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() =>
                    navigation.navigate('FinancialInvoiceDetails', {
                      id: item.id.toString(),
                      routeFrom: 'revenue',
                      title: item.senderReference,
                    })
                  }
                >
                  <Card
                    key={index}
                    amount={item.totalAmount}
                    invoice={item.senderReference}
                    invoice_date={item.date}
                    status={item.outgoingStatus}
                  />
                </TouchableOpacity>
              )}
              contentContainerStyle={{paddingBottom: 20}}
              data={outgoingInvoices}
              initialNumToRender={20}
              keyExtractor={(item: Invoice) => `Outgoing-${item.id}`}
              pointerEvents={isPageChange ? 'none' : 'auto'}
              showsVerticalScrollIndicator={false}
              onEndReached={outgoingInvoices?.length > 10 ? loadNextPage : null}
              onEndReachedThreshold={0.1}
            />
          )}
        </Box>
      </Box>

      {isPageChange ? (
        <Box bg={Colors.white} h={ms(40)} justifyContent="center" zIndex={999}>
          <LoadingAnimated />
        </Box>
      ) : totalEnabled ? (
        <Shadow viewStyle={{width: '100%'}}>
          <Box
            bg={Colors.white}
            p={ms(12)}
            pb={ms(insets.bottom && insets.bottom)}
          >
            <TouchableOpacity
              activeOpacity={1}
              style={{backgroundColor: Colors.white}}
              onPress={() => setTotalEnabled(!totalEnabled)}
            >
              <CardTotalDetails
                value={
                  invoiceStatistics?.length > 0
                    ? invoiceStatistics[0]?.unpaidOutgoing || 0
                    : 0
                }
                label={t('sent')}
              />
              <CardTotalDetails
                value={
                  invoiceStatistics?.length > 0
                    ? invoiceStatistics[0]?.paidOutgoing || 0
                    : 0
                }
                label={t('payment_confirmed')}
              />
            </TouchableOpacity>
          </Box>
        </Shadow>
      ) : (
        <Shadow viewStyle={{width: '100%'}}>
          <Box bg={Colors.white} pb={ms(insets.bottom && insets.bottom - 12)}>
            <CardTotal
              value={
                invoiceStatistics?.length > 0
                  ? invoiceStatistics[0]?.totalOutgoing || 0
                  : 0
              }
              label={t('totalRevenue')}
            />
          </Box>
        </Shadow>
      )}
    </Box>
  )
}

export default Revenue
