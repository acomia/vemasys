import React from 'react'
import {TouchableOpacity} from 'react-native'
import {
  Box,
  Button,
  Divider,
  Flex,
  HStack,
  Image,
  ScrollView,
  Text,
  VStack,
} from 'native-base'
import {NativeStackScreenProps} from '@react-navigation/native-stack'
import {ms} from 'react-native-size-matters'
import moment from 'moment'

import {
  CharterStatus,
  IconButton,
  LoadingAnimated,
  NoInternetConnectionMessage,
} from '@bluecentury/components'
import {Icons} from '@bluecentury/assets'
import {Colors} from '@bluecentury/styles'
import {useCharters, useEntity} from '@bluecentury/stores'
import {formatLocationLabel} from '@bluecentury/constants'
import {useTranslation} from 'react-i18next'
import {RootStackParamList} from '@bluecentury/types/nav.types'

type Props = NativeStackScreenProps<RootStackParamList, 'CharterDetails'>
export default function CharterDetails({navigation, route}: Props) {
  const {t} = useTranslation()
  const {entityType} = useEntity()
  const {viewPdf, signedDocumentsArray, isCharterLoading} = useCharters()

  const {charter, isCreator} = route.params

  const computeCargo = (cargo: any[]) => {
    return cargo.reduce(
      (accumulator, cargo) =>
        accumulator +
        parseInt(cargo.actualAmount == null ? 0 : cargo.actualAmount),
      0
    )
  }

  const renderCargoDetails = (cargo: any, index: number) => {
    return (
      <Box
        key={index}
        borderColor={Colors.light}
        borderRadius={ms(5)}
        borderWidth={1}
        mb={ms(6)}
      >
        <Text color="#29B7EF" fontWeight="semibold" mx={ms(10)} my={ms(10)}>
          {cargo?.type?.nameEn || cargo?.type?.nameNl}
        </Text>
        <HStack borderColor={Colors.light} borderTopWidth={1}>
          <HStack alignItems="center" flex="1" my={ms(10)}>
            <Text ml={ms(10)}>{t('booked')}</Text>
            <Text bold color={Colors.disabled} ml={ms(10)}>
              {parseInt(cargo?.amount) || 0} MT
            </Text>
          </HStack>
          <HStack
            alignItems="center"
            borderColor="#F0F0F0"
            borderLeftWidth={ms(1)}
            flex="1"
          >
            <Text ml={ms(10)}>{t('actual')}</Text>
            <Text bold color="#29B7EF" ml={ms(10)}>
              {parseInt(cargo?.actualAmount) || 0} MT
            </Text>
          </HStack>
        </HStack>
      </Box>
    )
  }

  const renderRoutes = (navlogs: any, index: number) => {
    return (
      <HStack key={index} alignItems="center">
        <VStack alignItems="center">
          <Box flex="1">
            {index > 0 && (
              <Box backgroundColor={Colors.azure} height="full" width={ms(2)} />
            )}
          </Box>
          <Image
            alt="triple-arrow-navlogs"
            resizeMode="contain"
            source={Icons.navlog_pin}
          />
          <Box flex="1">
            {index != charter.navigationLogs.length - 1 && (
              <Box backgroundColor={Colors.azure} height="full" width={ms(2)} />
            )}
          </Box>
        </VStack>

        <TouchableOpacity
          style={{
            flex: 1,
            borderRadius: ms(5),
            borderWidth: 1,
            borderColor: Colors.light,
            marginBottom: ms(10),
            marginLeft: ms(-20),
            zIndex: -1,
          }}
          activeOpacity={0.6}
          onPress={() =>
            navigation.navigate('PlanningDetails', {
              navlog: navlogs,
              title: formatLocationLabel(navlogs.location),
            })
          }
        >
          <HStack
            alignItems="center"
            justifyContent="space-between"
            px={ms(25)}
            py={ms(15)}
          >
            <VStack maxWidth="88%">
              <Text color={Colors.text} fontWeight="medium">
                {navlogs.bulkCargo.some(
                  (cargo: {isLoading: boolean}) => cargo.isLoading === false
                )
                  ? t('to')
                  : t('from')}
                {navlogs.location &&
                  navlogs.location.locationName &&
                  `[${navlogs.location.locationName}] `}
                {navlogs.location && navlogs.location && navlogs.location.name}
              </Text>
              <Text
                color={
                  navlogs.bulkCargo.some(
                    (cargo: {isLoading: boolean}) => cargo.isLoading === false
                  )
                    ? '#FA5555'
                    : '#6BBF87'
                }
                fontWeight="medium"
              >
                {moment(navlogs.plannedEta).format('DD MMM YYYY')} -{' '}
                {moment(navlogs.plannedEta).format('H:SS')}
              </Text>
              <HStack alignItems="center">
                <Text style={{fontWeight: 'bold', color: '#29B7EF'}}>
                  {navlogs.bulkCargo.some(
                    (cargo: {isLoading: boolean}) => cargo.isLoading === false
                  )
                    ? `${computeCargo(navlogs.bulkCargo)} MT `
                    : '0 MT '}
                </Text>
                <Image
                  alt="triple-arrow-navlogs"
                  mx={ms(5)}
                  resizeMode="contain"
                  source={Icons.triple_arrow}
                />
                <Text
                  style={{fontSize: 16, fontWeight: 'bold', color: '#29B7EF'}}
                >
                  {navlogs.bulkCargo.some(
                    (cargo: {isLoading: boolean}) => cargo.isLoading === false
                  )
                    ? ' 0 MT'
                    : ` ${computeCargo(navlogs.bulkCargo)} MT`}
                </Text>
              </HStack>
            </VStack>
            {navlogs.bulkCargo.some(
              (cargo: {isLoading: boolean}) => cargo.isLoading === false
            ) ? (
              <Image
                alt="triple-arrow-navlogs"
                resizeMode="contain"
                source={Icons.unloading}
              />
            ) : (
              <Image
                alt="triple-arrow-navlogs"
                resizeMode="contain"
                source={Icons.loading}
              />
            )}
          </HStack>
        </TouchableOpacity>
      </HStack>
    )
  }

  const renderInvolvedParties = (party: any) => {
    return (
      <Box
        borderColor={Colors.light}
        borderRadius={ms(5)}
        borderWidth={1}
        mb={ms(6)}
      >
        {party.financialInformation && party.financialInformation.name && (
          <VStack
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start',
            }}
          >
            <Text>{party.financialInformation.name}</Text>
            <Text>Fleet</Text>
          </VStack>
        )}
        <Divider />
        {party.entity && party.entity.alias && (
          <VStack
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start',
            }}
          >
            <Text>{party.entity.alias}</Text>
            <Text>Vessel</Text>
          </VStack>
        )}
      </Box>
    )
  }

  const renderContacts = (contact: any, index: number) => {
    return (
      <HStack
        key={index}
        alignItems="center"
        bg={Colors.white}
        borderColor={Colors.light}
        borderRadius={ms(5)}
        borderWidth={1}
        justifyContent="space-between"
        mb={ms(10)}
        p={ms(10)}
        shadow={3}
      >
        <Text bold>{contact.name}</Text>
        <Image
          alt="charter-contact"
          resizeMode="contain"
          source={Icons.charter_contact}
        />
      </HStack>
    )
  }

  const handlePDFView = async () => {
    const path = await viewPdf(charter.id)
    // const path = signedDocumentsArray.find(
    //   item => item.charter_id === charter.id
    // )
    console.log('PATH', signedDocumentsArray)
    navigation.navigate('PDFView', {
      path: `${path}`,
    })
  }

  const renderRefNumber = (itemData: any) => {
    if (!itemData?.customerReference && !itemData?.supplierReference) {
      return (
        <Text bold color={Colors.azure} fontSize={ms(22)} textAlign="left">
          {itemData?.clientReference || itemData?.vesselReference}
        </Text>
      )
    }

    return (
      <VStack space={ms(10)}>
        {itemData?.customerReference && (
          <Text bold color={Colors.azure} fontSize={ms(22)} textAlign="left">
            {itemData?.customerReference}
          </Text>
        )}
        {itemData?.supplierReference && (
          <Text bold color={Colors.azure} fontSize={ms(22)} textAlign="left">
            {itemData?.supplierReference}
          </Text>
        )}
      </VStack>
    )
  }

  if (isCharterLoading) return <LoadingAnimated />

  return (
    <Flex flex="1">
      <NoInternetConnectionMessage />
      <Box
        backgroundColor={Colors.white}
        borderTopLeftRadius={ms(15)}
        borderTopRightRadius={ms(15)}
        flex="1"
        p={ms(12)}
      >
        <HStack alignItems="center" justifyContent="space-between">
          <VStack maxWidth="73%">
            {renderRefNumber(charter)}
            <Text bold color={Colors.secondary}>
              {moment(charter.startDate).format('DD MMM YYYY')} -
              <Text bold color={Colors.danger}>
                {' '}
                {moment(charter.endDate).format('DD MMM YYYY')}
              </Text>
            </Text>
          </VStack>
          <CharterStatus
            charter={charter}
            entityType={entityType}
            isCreator={isCreator}
          />
        </HStack>
        <Divider my={ms(15)} />
        <ScrollView flex="1" showsVerticalScrollIndicator={false}>
          <Text color={Colors.text} fontSize={ms(16)} fontWeight="semibold">
            {t('location')}
          </Text>
          <Box my={ms(15)}>
            {/* <Button
              leftIcon={
                <Image
                  alt="view-navlog"
                  source={Icons.list}
                  maxWidth={ms(15)}
                  maxHeight={ms(13)}
                  resizeMode="contain"
                />
              }
              mb={ms(10)}
              bg={Colors.primary}
              onPress={() => navigation.navigate('Planning')}
            >
              View Navlog
            </Button> */}
            <Button
              leftIcon={
                <Image
                  alt="view-map"
                  maxHeight={ms(13)}
                  maxWidth={ms(15)}
                  resizeMode="contain"
                  source={Icons.map_marked}
                />
              }
              bg={Colors.primary}
              onPress={() => navigation.navigate('MapView')}
            >
              {t('viewMap')}
            </Button>
          </Box>
          {/* Cargo */}
          <Text color={Colors.text} fontSize={ms(16)} fontWeight="semibold">
            {t('cargo')}
          </Text>
          <Box my={ms(15)}>
            {charter.navigationLogs.map((navlog: {bulkCargo: any[]}) =>
              navlog.bulkCargo.map((cargo: any, index: number) => {
                if (cargo.isLoading) {
                  return renderCargoDetails(cargo, index)
                }
              })
            )}
          </Box>
          {/* Route */}
          <Text color={Colors.text} fontSize={ms(16)} fontWeight="semibold">
            {t('route')}
          </Text>
          <Box my={ms(15)}>
            {charter.navigationLogs.map(
              (navlog: {bulkCargo: string | any[]}, index: number) =>
                navlog.bulkCargo.length > 0 ? renderRoutes(navlog, index) : null
            )}
          </Box>
          {/* Parties */}
          {/* <Text fontSize={ms(16)} fontWeight="semibold" color={Colors.text}>
            Parties
          </Text>
          <Box my={ms(15)}>
            {charter.involvedParties.map((party: any, i: number) => {
              if (i > 0) {
                return renderInvolvedParties(party)
              }
            })}
          </Box> */}
          {/* Crew */}
          {/* <Text fontSize={ms(16)} fontWeight="semibold" color={Colors.text}>
            Crew
          </Text>
          <Box my={ms(15)}></Box> */}
          {/*  Linked Charters */}
          {/* <Text fontSize={ms(16)} fontWeight="semibold" color={Colors.text}>
            Linked Charters
          </Text>
          <Box my={ms(15)}></Box> */}
          {/* Cargo History */}
          {/* <Text fontSize={ms(16)} fontWeight="semibold" color={Colors.text}>
            Cargo History
          </Text>
          <Box my={ms(15)}></Box> */}
          {/* Contacts */}
          <Text color={Colors.text} fontSize={ms(16)} fontWeight="semibold">
            {t('contacts')}
          </Text>
          <Box my={ms(15)}>
            {charter.additionalContacts.map((contact: any, index: number) =>
              renderContacts(contact.contact, index)
            )}
          </Box>
          {/* Remarks */}
          {/* <Text fontSize={ms(16)} fontWeight="semibold" color={Colors.text}>
            Remarks
          </Text>
          <Box my={ms(15)}>
            <Button backgroundColor="#E0E0E0" size="md" width={ms(120)}>
              Add Remarks
            </Button>
          </Box> */}
          {/* Documents */}
          {/* <Text fontSize={ms(16)} fontWeight="semibold" color={Colors.text}>
            Documents
          </Text>
          <Box my={ms(15)}>
            <Button backgroundColor="#E0E0E0" size="md" width={ms(120)}>
              Upload
            </Button>
          </Box> */}
        </ScrollView>
        <Box bottom={ms(10)} position="absolute" right={ms(20)}>
          <IconButton
            size={ms(50)}
            source={Icons.pdf}
            onPress={handlePDFView}
          />
        </Box>
      </Box>
    </Flex>
  )
}
