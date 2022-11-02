import React, {useEffect, useState} from 'react'
import {Platform, RefreshControl, TouchableOpacity} from 'react-native'
import {Box, FlatList, HStack, Select, Skeleton, Text} from 'native-base'
import {Shadow} from 'react-native-shadow-2'
import moment from 'moment'
import {ms} from 'react-native-size-matters'

import {Colors} from '@bluecentury/styles'
import {useEntity, useFinancial} from '@bluecentury/stores'
import {useNavigation} from '@react-navigation/native'
import {LoadingAnimated} from '@bluecentury/components'
import {useSafeAreaInsets} from 'react-native-safe-area-context'

const Revenue = () => {
  const insets = useSafeAreaInsets()
  const navigation = useNavigation()
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
    switch (status) {
      case 'paid':
        return 'Paid'
      case 'read':
        return 'Read'
      case 'stored':
        return 'Stored'
      case 'sent':
        return 'Sent'
      case 'unpaid':
        return 'Unpaid'
      case 'new':
        return 'New'
      case 'payment_confirmed':
        return 'Payment confirmed'
      default:
        return 'Paid'
    }
  }

  const Card = ({invoice, invoice_date, amount, status}: any) => {
    return (
      <HStack
        overflow="hidden"
        justifyContent="space-between"
        alignItems="center"
        bg={Colors.white}
        borderWidth={1}
        borderColor={Colors.light}
        borderRadius={ms(5)}
        shadow={1}
        py={ms(5)}
        px={ms(15)}
        mb={ms(10)}
      >
        <Box alignItems="flex-start">
          <Text fontWeight="medium" color={Colors.text}>
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
            borderRadius={15}
            px={ms(15)}
            justifyContent="center"
            alignItems="center"
            bg={statusBgColor(status)}
          >
            <Text fontSize={ms(12)} fontWeight="bold" color={Colors.white}>
              {statusLabel(status)}
            </Text>
          </Box>
        </Box>
      </HStack>
    )
  }

  const CardTotal = ({label, value}: any) => {
    return (
      <TouchableOpacity
        style={{padding: 12}}
        activeOpacity={0.8}
        onPress={() => setTotalEnabled(!totalEnabled)}
      >
        <HStack
          justifyContent="space-between"
          alignItems="center"
          height={ms(48)}
          width="100%"
          borderWidth={1}
          borderColor={Colors.light}
          bg={Colors.secondary}
          borderRadius={5}
          px={ms(16)}
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
                fontWeight="bold"
                fontSize={ms(18)}
                textAlign="right"
                color={Colors.white}
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

  const CardTotalDetails = ({label, value}: any) => {
    return (
      <HStack
        justifyContent="space-between"
        alignItems="center"
        height={ms(48)}
        width="100%"
        borderWidth={1}
        borderColor={Colors.light}
        bg={Colors.secondary}
        borderRadius={5}
        px={ms(16)}
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
              fontWeight="bold"
              fontSize={ms(18)}
              textAlign="right"
              color={Colors.white}
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

  const onPullToReload = () => {
    getInvoices('Outgoing', selectedYear, 1)
    setPage(1)
  }

  return (
    <Box flex="1">
      <Box flex="1">
        <Box px={ms(15)} py={ms(25)}>
          <Select
            minWidth="300"
            accessibilityLabel=""
            color={Colors.white}
            bg={Colors.azure}
            fontWeight="medium"
            fontSize={ms(16)}
            selectedValue={selectedYear}
            onValueChange={val => handleFilterByYear(val)}
          >
            {Array.apply(null, {length: 5}).map((e, i) => {
              let year = new Date().getFullYear() - i
              return <Select.Item key={i} label={`${year}`} value={`${year}`} />
            })}
          </Select>
        </Box>
        <Box flex="1" px={ms(15)} py={ms(25)} bg={Colors.white}>
          <Text
            fontSize={ms(20)}
            fontWeight="bold"
            color={Colors.azure}
            mb={ms(20)}
          >
            Outgoing Invoices
          </Text>
          {isFinancialLoading && !isPageChange ? (
            <LoadingAnimated />
          ) : (
            <FlatList
              data={outgoingInvoices}
              renderItem={({item, index}: any) => (
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() =>
                    navigation.navigate('FinancialInvoiceDetails', {
                      id: item.id,
                      routeFrom: 'revenue',
                      title: item.senderReference,
                    })
                  }
                >
                  <Card
                    key={index}
                    invoice={item.senderReference}
                    invoice_date={item.date}
                    amount={item.totalAmount}
                    status={item.outgoingStatus}
                  />
                </TouchableOpacity>
              )}
              keyExtractor={(item: any) => `Outgoing-${item.id}`}
              refreshControl={
                <RefreshControl
                  onRefresh={onPullToReload}
                  refreshing={isFinancialLoading}
                />
              }
              contentContainerStyle={{paddingBottom: 20}}
              showsVerticalScrollIndicator={false}
              initialNumToRender={20}
              onEndReachedThreshold={0.1}
              onEndReached={outgoingInvoices?.length > 10 ? loadNextPage : null}
              pointerEvents={isPageChange ? 'none' : 'auto'}
            />
          )}
        </Box>
      </Box>

      {isPageChange ? (
        <Box h={ms(40)} bg={Colors.white} justifyContent="center" zIndex={999}>
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
              style={{backgroundColor: Colors.white}}
              activeOpacity={1}
              onPress={() => setTotalEnabled(!totalEnabled)}
            >
              <CardTotalDetails
                label="Sent"
                value={
                  invoiceStatistics?.length > 0
                    ? invoiceStatistics[0]?.unpaidOutgoing || 0
                    : 0
                }
              />
              <CardTotalDetails
                label="Payment confirmed"
                value={
                  invoiceStatistics?.length > 0
                    ? invoiceStatistics[0]?.paidOutgoing || 0
                    : 0
                }
              />
            </TouchableOpacity>
          </Box>
        </Shadow>
      ) : (
        <Shadow viewStyle={{width: '100%'}}>
          <Box bg={Colors.white} pb={ms(insets.bottom && insets.bottom - 12)}>
            <CardTotal
              label="Total revenue"
              value={
                invoiceStatistics?.length > 0
                  ? invoiceStatistics[0]?.totalOutgoing || 0
                  : 0
              }
            />
          </Box>
        </Shadow>
      )}
    </Box>
  )
}

export default Revenue
