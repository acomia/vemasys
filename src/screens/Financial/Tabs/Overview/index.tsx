import React, {useEffect, useState} from 'react'
import {Platform, RefreshControl} from 'react-native'
import {Box, HStack, ScrollView, Select, Skeleton, Text} from 'native-base'
import {ms} from 'react-native-size-matters'

import {useEntity, useFinancial} from '@bluecentury/stores'
import {Colors} from '@bluecentury/styles'
import {useSafeAreaInsets} from 'react-native-safe-area-context'
import {useTranslation} from 'react-i18next'

const Overview = () => {
  const {t} = useTranslation()
  const insets = useSafeAreaInsets()
  const {isFinancialLoading, invoiceStatistics, getInvoiceStatistics} =
    useFinancial()
  const {vesselId} = useEntity()
  const [selectedYear, setSelectedYear] = useState(
    new Date().getFullYear().toString()
  )

  useEffect(() => {
    getInvoiceStatistics(selectedYear)
  }, [vesselId])

  const Card = ({title, children}: any) => {
    return (
      <Box
        borderWidth={1}
        borderColor={Colors.border}
        borderRadius={5}
        mb={ms(10)}
        overflow="hidden"
      >
        <Box p={ms(15)} bg={Colors.border}>
          <Text fontSize={ms(16)} bold color={Colors.azure}>
            {title}
          </Text>
        </Box>
        <Box p={ms(15)} bg={Colors.white}>
          {children}
        </Box>
      </Box>
    )
  }

  const CardContent = ({status, value}: any) => {
    return (
      <HStack
        justifyContent="space-between"
        alignItems="center"
        height={ms(50)}
        width="100%"
        borderWidth={1}
        borderColor={Colors.light}
        borderRadius={5}
        px={ms(16)}
        mb={ms(7)}
      >
        <Text flex="1" fontWeight="medium" color={Colors.text}>
          {status}
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
            isLoaded={!isFinancialLoading}
            startColor={Colors.light}
          >
            <Text
              bold
              textAlign="right"
              color={
                status?.toLowerCase() == 'paid' ||
                status?.toLowerCase() == 'total balance'
                  ? Colors.secondary
                  : status?.toLowerCase() == 'unpaid' ||
                    status?.toLowerCase() == 'total costs'
                  ? Colors.danger
                  : Colors.highlighted_text
              }
            >
              {status?.toLowerCase().includes('days')
                ? `${value} days`
                : `€ ${
                    Platform.OS === 'ios'
                      ? Number(value).toLocaleString('en-GB', {
                          maximumFractionDigits: 2,
                          minimumFractionDigits: 2,
                        })
                      : Number(value)
                          .toFixed(2)
                          .replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
                  }`}
            </Text>
          </Skeleton>
        </Box>
      </HStack>
    )
  }

  const handleFilterByYear = e => {
    setSelectedYear(e)
    getInvoiceStatistics(e)
  }

  const onPullToReload = () => {
    getInvoiceStatistics(selectedYear)
  }

  return (
    <Box flex="1">
      <ScrollView
        contentContainerStyle={{flexGrow: 1, paddingBottom: 60}}
        scrollEventThrottle={16}
        refreshControl={
          <RefreshControl
            onRefresh={onPullToReload}
            refreshing={isFinancialLoading}
          />
        }
        bg="#F7F7F7"
        showsVerticalScrollIndicator={false}
      >
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
        <Box flex="1" px={ms(12)} py={ms(15)} bg={Colors.white}>
          <Card title={t('incoming')}>
            <CardContent
              status={t('paid')}
              value={
                invoiceStatistics?.length > 0
                  ? invoiceStatistics[0]?.paidIncoming || 0
                  : 0
              }
            />
            <CardContent
              status={t('unpaid')}
              value={
                invoiceStatistics?.length > 0
                  ? invoiceStatistics[0]?.unpaidIncoming || 0
                  : 0
              }
            />
          </Card>
          <Card title={t('outgoing')}>
            <CardContent
              status={t('paid')}
              value={
                invoiceStatistics?.length > 0
                  ? invoiceStatistics[0]?.paidOutgoing || 0
                  : 0
              }
            />
            <CardContent
              status={t('unpaid')}
              value={
                invoiceStatistics?.length > 0
                  ? invoiceStatistics[0]?.unpaidOutgoing || 0
                  : 0
              }
            />
          </Card>
          {/* <Card title={'Daily Average'}>
              <CardContent status="Current Daily Avg" value="3500" />
              <CardContent status="Days Navigated" value="200" />
            </Card> */}
          <Card title={t('total')}>
            <CardContent
              status={t('totalTurnover')}
              value={
                invoiceStatistics?.length > 0
                  ? invoiceStatistics[0]?.totalOutgoing || 0
                  : 0
              }
            />
            <CardContent
              status={t('totalCosts')}
              value={
                invoiceStatistics?.length > 0
                  ? invoiceStatistics[0]?.totalIncoming || 0
                  : 0
              }
            />
            <CardContent
              status={t('totalBalance')}
              value={
                invoiceStatistics?.length > 0
                  ? invoiceStatistics[0]?.balance || 0
                  : 0
              }
            />
          </Card>
        </Box>
      </ScrollView>
      <HStack
        flex="1"
        p={ms(12)}
        pb={ms(insets.bottom ? insets.bottom : 12)}
        bg={Colors.white}
        position="absolute"
        bottom={0}
        left={0}
        right={0}
      >
        <HStack
          justifyContent="space-between"
          alignItems="center"
          height={ms(48)}
          width="100%"
          borderWidth={1}
          borderColor={Colors.light}
          bg={Colors.highlighted_text}
          borderRadius={5}
          px={ms(16)}
        >
          <Text flex="1" fontWeight="medium" color={Colors.white}>
            {t('totalBalance')}
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
                bold
                fontSize={ms(18)}
                textAlign="right"
                color={Colors.white}
              >
                {`€ ${
                  Platform.OS === 'ios'
                    ? Number(
                        invoiceStatistics?.length > 0
                          ? invoiceStatistics[0]?.balance || 0
                          : 0
                      ).toLocaleString('en-GB', {
                        maximumFractionDigits: 2,
                        minimumFractionDigits: 2,
                      })
                    : Number(
                        invoiceStatistics?.length > 0
                          ? invoiceStatistics[0]?.balance || 0
                          : 0
                      )
                        .toFixed(2)
                        .replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
                }`}
              </Text>
            </Skeleton>
          </Box>
        </HStack>
      </HStack>
    </Box>
  )
}

export default Overview
