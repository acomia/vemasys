import React, {useEffect} from 'react'
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
  VStack
} from 'native-base'
import {NativeStackScreenProps} from '@react-navigation/native-stack'
import {ms} from 'react-native-size-matters'
import moment from 'moment'

import {CharterStatus, IconButton} from '@bluecentury/components'
import {icons} from '@bluecentury/assets'
import {Colors} from '@bluecentury/styles'
import {useAuth, useCharters, useEntity} from '@bluecentury/stores'

type Props = NativeStackScreenProps<RootStackParamList>
export default function CharterDetails({navigation, route}: Props) {
  const {entityType} = useEntity()
  const {viewPdf, isCharterLoading} = useCharters()
  const {token} = useAuth()

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <IconButton source={icons.ellipsis} onPress={() => {}} />
      )
    })
  }, [])

  const {charter} = route.params

  const computeCargo = (cargo: any[]) => {
    return cargo.reduce(
      (accumulator, cargo) => accumulator + parseInt(cargo.amount),
      0
    )
  }

  const renderCargoDetails = (cargo: any) => {
    return (
      <Box
        borderRadius={ms(5)}
        borderWidth={1}
        borderColor={Colors.light}
        mb={ms(6)}
      >
        <Text my={ms(10)} mx={ms(10)} color="#29B7EF" fontWeight="semibold">
          {cargo.type.nameEn || cargo.type.nameNl}
        </Text>
        <HStack borderTopWidth={1} borderColor={Colors.light}>
          <HStack flex={1} alignItems="center" my={ms(10)}>
            <Text ml={ms(10)}>Booked:</Text>
            <Text ml={ms(10)} fontWeight="bold" color={Colors.disabled}>
              {parseInt(cargo.amount) || 0} MT
            </Text>
          </HStack>
          <HStack
            flex={1}
            borderLeftWidth={ms(1)}
            borderColor="#F0F0F0"
            alignItems="center"
          >
            <Text ml={ms(10)}>Actual:</Text>
            <Text ml={ms(10)} fontWeight="bold" color="#29B7EF">
              {parseInt(cargo.actualAmount) || 0} MT
            </Text>
          </HStack>
        </HStack>
      </Box>
    )
  }

  const renderRoutes = (navlogs: any, index: number) => {
    return (
      <HStack alignItems="center">
        <VStack alignItems="center">
          <Box flex={1}>
            {index > 0 && (
              <Box width={ms(2)} height="full" backgroundColor={Colors.azure} />
            )}
          </Box>
          <Image
            alt="triple-arrow-navlogs"
            source={icons.navlog_pin}
            resizeMode="contain"
          />
          <Box flex={1}>
            {index != charter.navigationLogs.length - 1 && (
              <Box width={ms(2)} height="full" backgroundColor={Colors.azure} />
            )}
          </Box>
        </VStack>

        <TouchableOpacity
          activeOpacity={0.6}
          style={{
            flex: 1,
            borderRadius: ms(5),
            borderWidth: 1,
            borderColor: Colors.light,
            marginBottom: ms(10),
            marginLeft: ms(-20),
            zIndex: -1
          }}
        >
          <HStack
            px={ms(25)}
            py={ms(15)}
            alignItems="center"
            justifyContent="space-between"
          >
            <VStack maxWidth="88%">
              <Text fontWeight="medium" color={Colors.text}>
                {navlogs.bulkCargo.some(
                  (cargo: {isLoading: boolean}) => cargo.isLoading === false
                )
                  ? 'To: '
                  : 'From: '}
                {navlogs.location &&
                  navlogs.location.locationName &&
                  `[${navlogs.location.locationName}] `}
                {navlogs.location && navlogs.location && navlogs.location.name}
              </Text>
              <Text
                fontWeight="medium"
                color={
                  navlogs.bulkCargo.some(
                    (cargo: {isLoading: boolean}) => cargo.isLoading === false
                  )
                    ? '#FA5555'
                    : '#6BBF87'
                }
              >
                {moment(navlogs.plannedETA).format('DD MMM YYYY')} -{' '}
                {moment(navlogs.plannedETA).format('H:SS')}
              </Text>
              <HStack alignItems="center">
                <Text style={{fontWeight: 'bold', color: '#29B7EF'}}>
                  {navlogs.bulkCargo.some(
                    (cargo: {isLoading: boolean}) => cargo.isLoading === false
                  )
                    ? `${computeCargo(navlogs.bulkCargo)} MT `
                    : `0 MT `}
                </Text>
                <Image
                  alt="triple-arrow-navlogs"
                  source={icons.triple_arrow}
                  mx={ms(5)}
                  resizeMode="contain"
                />
                <Text
                  style={{fontSize: 16, fontWeight: 'bold', color: '#29B7EF'}}
                >
                  {navlogs.bulkCargo.some(
                    (cargo: {isLoading: boolean}) => cargo.isLoading === false
                  )
                    ? ` 0 MT`
                    : ` ${computeCargo(navlogs.bulkCargo)} MT`}
                </Text>
              </HStack>
            </VStack>
            {navlogs.bulkCargo.some(
              (cargo: {isLoading: boolean}) => cargo.isLoading === false
            ) ? (
              <Image
                alt="triple-arrow-navlogs"
                source={icons.unloading}
                resizeMode="contain"
              />
            ) : (
              <Image
                alt="triple-arrow-navlogs"
                source={icons.loading}
                resizeMode="contain"
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
        borderRadius={ms(5)}
        borderWidth={1}
        borderColor={Colors.light}
        mb={ms(6)}
      >
        {party.financialInformation && party.financialInformation.name && (
          <VStack
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start'
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
              alignItems: 'flex-start'
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
        p={ms(10)}
        borderWidth={1}
        borderColor={Colors.light}
        borderRadius={ms(5)}
        alignItems="center"
        justifyContent="space-between"
        mb={ms(10)}
        bg={Colors.white}
        shadow={3}
      >
        <Text fontWeight="bold">{contact.name}</Text>
        <Image
          alt="charter-contact"
          source={icons.charter_contact}
          resizeMode="contain"
        />
      </HStack>
    )
  }

  const handlePDFView = () => {
    viewPdf(charter.id, token)
    // if (!isCharterLoading) {
    //   navigation.navigate('PDFView')
    // }
  }

  return (
    <Flex flex={1}>
      <Box
        flex={1}
        backgroundColor={Colors.white}
        borderTopLeftRadius={ms(15)}
        borderTopRightRadius={ms(15)}
        p={ms(12)}
      >
        <HStack alignItems="center" justifyContent="space-between">
          <VStack maxWidth="73%">
            <Text
              fontSize={ms(22)}
              fontWeight="bold"
              color={Colors.azure}
              textAlign="left"
            >
              {charter.vesselReference}
            </Text>
            <Text fontWeight="bold" color={Colors.secondary}>
              {moment(charter.startDate).format('DD MMM YYYY')} -
              <Text fontWeight="bold" color={Colors.danger}>
                {' '}
                {moment(charter.endDate).format('DD MMM YYYY')}
              </Text>
            </Text>
          </VStack>
          <CharterStatus entityType={entityType} charter={charter} />
        </HStack>
        <Divider my={ms(15)} />
        <ScrollView flex={1} showsVerticalScrollIndicator={false}>
          <Text fontSize={ms(16)} fontWeight="semibold" color={Colors.text}>
            Location
          </Text>
          <Box my={ms(15)}>
            <Button
              leftIcon={
                <Image
                  alt="view-navlog"
                  source={icons.list}
                  maxWidth={ms(15)}
                  maxHeight={ms(13)}
                  resizeMode="contain"
                />
              }
              mb={ms(10)}
              backgroundColor={Colors.primary}
            >
              View Navlog
            </Button>
            <Button
              leftIcon={
                <Image
                  alt="view-map"
                  source={icons.map_marked}
                  maxWidth={ms(15)}
                  maxHeight={ms(13)}
                  resizeMode="contain"
                />
              }
              backgroundColor={Colors.primary}
            >
              View Map
            </Button>
          </Box>
          {/* Cargo */}
          <Text fontSize={ms(16)} fontWeight="semibold" color={Colors.text}>
            Cargo
          </Text>
          <Box my={ms(15)}>
            {charter.navigationLogs.map((navlog: {bulkCargo: any[]}) =>
              navlog.bulkCargo.map(cargo => {
                if (cargo.isLoading) {
                  return renderCargoDetails(cargo)
                }
              })
            )}
          </Box>
          {/* Route */}
          <Text fontSize={ms(16)} fontWeight="semibold" color={Colors.text}>
            Route
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
          <Text fontSize={ms(16)} fontWeight="semibold" color={Colors.text}>
            Contacts
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
        <IconButton
          source={icons.pdf}
          btnStyle={{position: 'absolute', bottom: 30, right: 20}}
          iconStyle={{width: 50, height: 50}}
          onPress={handlePDFView}
        />
      </Box>
    </Flex>
  )
}
