import React, {useEffect, useState} from 'react'
import {Platform, RefreshControl} from 'react-native'
import {
  Box,
  HStack,
  ScrollView,
  Select,
  Skeleton,
  Text,
  Modal,
  Button,
  ChevronRightIcon,
  Pressable,
} from 'native-base'
import {ms} from 'react-native-size-matters'

import {useEntity, useFinancial} from '@bluecentury/stores'
import {Colors} from '@bluecentury/styles'
import {useSafeAreaInsets} from 'react-native-safe-area-context'
import {useTranslation} from 'react-i18next'
import {LoadingAnimated} from '@bluecentury/components'

type CardContentArgument = {
  status: string
  value: string
  callback?: () => void
  withArrow?: boolean
}

const Overview = () => {
  const {t} = useTranslation()
  const insets = useSafeAreaInsets()
  const {isFinancialLoading, invoiceStatistics, getInvoiceStatistics} =
    useFinancial()
  const {vesselId} = useEntity()
  const [selectedYear, setSelectedYear] = useState(
    new Date().getFullYear().toString()
  )
  const [isIncomingVisible, setIsIncomingVisible] = useState(false)
  const [isOutgoingVisible, setIsOutgoingVisible] = useState(false)

  useEffect(() => {
    getInvoiceStatistics(selectedYear)
  }, [vesselId])

  const Card = ({title, children}: any) => {
    return (
      <Box
        borderColor={Colors.border}
        borderRadius={5}
        borderWidth={1}
        mb={ms(10)}
        overflow="hidden"
      >
        <Box bg={Colors.border} p={ms(15)}>
          <Text bold color={Colors.azure} fontSize={ms(16)}>
            {title}
          </Text>
        </Box>
        <Box bg={Colors.white} p={ms(15)}>
          {children}
        </Box>
      </Box>
    )
  }

  const CardContent = ({
    status,
    value,
    callback,
    withArrow,
  }: CardContentArgument) => {
    return (
      <Pressable onPress={callback ? callback : null}>
        <HStack
          alignItems="center"
          borderColor={Colors.light}
          borderRadius={5}
          borderWidth={1}
          height={ms(50)}
          justifyContent="space-between"
          mb={ms(7)}
          px={ms(16)}
          width="100%"
        >
          <Text color={Colors.text} flex="1" fontWeight="medium">
            {status}
          </Text>
          <HStack
            alignItems="center"
            borderColor="#E6E6E6"
            borderLeftWidth={ms(1)}
            flex="1"
            height="100%"
            justifyContent="flex-end"
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
                color={
                  status?.toLowerCase() == 'paid' ||
                  status?.toLowerCase() == 'total balance'
                    ? Colors.secondary
                    : status?.toLowerCase() == 'unpaid' ||
                      status?.toLowerCase() == 'total costs'
                    ? Colors.danger
                    : Colors.highlighted_text
                }
                mr={ms(16)}
                textAlign="right"
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
              {withArrow ? (
                <ChevronRightIcon color={Colors.text} size="4" />
              ) : null}
            </Skeleton>
          </HStack>
        </HStack>
      </Pressable>
    )
  }

  const handleFilterByYear = (e: string) => {
    setSelectedYear(e)
    getInvoiceStatistics(e)
  }

  const onPullToReload = () => {
    getInvoiceStatistics(selectedYear)
  }

  return (
    <Box flex="1">
      <ScrollView
        refreshControl={
          <RefreshControl
            refreshing={isFinancialLoading}
            onRefresh={onPullToReload}
          />
        }
        bg={Colors.light_grey}
        contentContainerStyle={{flexGrow: 1, paddingBottom: 60}}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
      >
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
        <Box bg={Colors.white} flex="1" px={ms(12)} py={ms(15)}>
          {/* <Card title={'Daily Average'}>
              <CardContent status="Current Daily Avg" value="3500" />
              <CardContent status="Days Navigated" value="200" />
            </Card> */}
          <Card title={t('total')}>
            <CardContent
              withArrow
              value={
                invoiceStatistics?.length > 0
                  ? invoiceStatistics[0]?.totalOutgoing || 0
                  : 0
              }
              callback={() => setIsOutgoingVisible(true)}
              status={t('totalTurnover')}
            />
            <CardContent
              withArrow
              value={
                invoiceStatistics?.length > 0
                  ? invoiceStatistics[0]?.totalIncoming || 0
                  : 0
              }
              callback={() => setIsIncomingVisible(true)}
              status={t('totalCosts')}
            />
            <CardContent
              value={
                invoiceStatistics?.length > 0
                  ? invoiceStatistics[0]?.balance || 0
                  : 0
              }
              status={t('totalBalance')}
            />
          </Card>
        </Box>
      </ScrollView>
      <HStack
        bg={Colors.white}
        bottom={0}
        flex="1"
        left={0}
        p={ms(12)}
        pb={ms(insets.bottom ? insets.bottom : 12)}
        position="absolute"
        right={0}
      >
        <HStack
          alignItems="center"
          bg={Colors.highlighted_text}
          borderColor={Colors.light}
          borderRadius={5}
          borderWidth={1}
          height={ms(48)}
          justifyContent="space-between"
          px={ms(16)}
          width="100%"
        >
          <Text color={Colors.white} flex="1" fontWeight="medium">
            {t('totalBalance')}
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
      <Modal
        closeOnOverlayClick={true}
        isOpen={isIncomingVisible}
        justifyContent="center"
        px={ms(15)}
        onClose={() => setIsIncomingVisible(false)}
      >
        <Modal.Content width="100%">
          <Card title={t('incoming')}>
            <CardContent
              value={
                invoiceStatistics?.length > 0
                  ? invoiceStatistics[0]?.paidIncoming || 0
                  : 0
              }
              status={t('paid')}
            />
            <CardContent
              value={
                invoiceStatistics?.length > 0
                  ? invoiceStatistics[0]?.unpaidIncoming || 0
                  : 0
              }
              status={t('unpaid')}
            />
          </Card>
          <Button
            alignSelf="center"
            bg={Colors.primary}
            mb={ms(12)}
            size="md"
            w="50%"
            onPress={() => setIsIncomingVisible(false)}
          >
            {t('close')}
          </Button>
        </Modal.Content>
      </Modal>
      <Modal
        closeOnOverlayClick={true}
        isOpen={isOutgoingVisible}
        justifyContent="center"
        px={ms(15)}
        onClose={() => setIsOutgoingVisible(false)}
      >
        <Modal.Content width="100%">
          <Card title={t('outgoing')}>
            <CardContent
              value={
                invoiceStatistics?.length > 0
                  ? invoiceStatistics[0]?.paidOutgoing || 0
                  : 0
              }
              status={t('paid')}
            />
            <CardContent
              value={
                invoiceStatistics?.length > 0
                  ? invoiceStatistics[0]?.unpaidOutgoing || 0
                  : 0
              }
              status={t('unpaid')}
            />
          </Card>
          <Button
            alignSelf="center"
            bg={Colors.primary}
            mb={ms(12)}
            size="md"
            w="50%"
            onPress={() => setIsOutgoingVisible(false)}
          >
            {t('close')}
          </Button>
        </Modal.Content>
      </Modal>
    </Box>
  )
}

export default Overview
