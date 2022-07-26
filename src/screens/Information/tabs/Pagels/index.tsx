import React, {useEffect, useState} from 'react'
import {
  Box,
  Divider,
  HStack,
  Icon,
  Image,
  Input,
  ScrollView,
  Text
} from 'native-base'
import {useInformation} from '@bluecentury/stores'
import MaterialIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import {Colors} from '@bluecentury/styles'
import {ms} from 'react-native-size-matters'
import {Icons} from '@bluecentury/assets'
import {LoadingIndicator} from '@bluecentury/components'

const Pegels = () => {
  const {isInformationLoading, pegels, streamGauges, getVesselPegels} =
    useInformation()
  const [searchedValue, setSearchedValue] = useState('')
  const [pegelsData, setPegelsData] = useState([])

  useEffect(() => {
    getVesselPegels('')
  }, [])

  useEffect(() => {
    setPegelsData(pegels)
  }, [pegels])

  const renderPegelList = (pegel: any) => (
    <HStack
      key={pegel.id}
      alignItems="center"
      borderWidth={1}
      borderColor={Colors.light}
      borderRadius={ms(5)}
      bg={Colors.white}
      shadow={1}
      mb={ms(4)}
      px={ms(10)}
      py={ms(8)}
    >
      <Text flex="2" fontWeight="medium">
        {pegel?.name}
      </Text>
      <HStack flex="1" alignItems="center" justifyContent="space-between">
        <Image
          alt={`Pegels-WaterLevel-${pegel.id}`}
          source={
            pegel.lastMeasurement && pegel.secondToLastMeasurement
              ? pegel.lastMeasurement.measureValue -
                  pegel.secondToLastMeasurement.measureValue >
                0
                ? Icons.water_rise
                : Icons.water_low
              : Icons.water_normal
          }
        />
        {pegel?.lastMeasurement && pegel?.lastMeasurement.measureValue ? (
          <Text
            fontWeight="bold"
            color={
              pegel.lastMeasurement && pegel.secondToLastMeasurement
                ? pegel?.lastMeasurement?.measureValue -
                    pegel?.secondToLastMeasurement?.measureValue >
                  0
                  ? Colors.secondary
                  : Colors.danger
                : Colors.highlighted_text
            }
          >
            {Math.trunc(pegel.lastMeasurement.measureValue)} cm
          </Text>
        ) : (
          <Text fontWeight="bold">N/A</Text>
        )}
      </HStack>
    </HStack>
  )

  const renderStreamGauges = () => {
    return streamGauges?.map(pegel => renderPegelList(pegel))
  }

  const renderPegels = () => {
    return pegelsData?.map((river: any, index: number) => (
      <Box key={`river-${index}`} mt={ms(20)}>
        <Text
          fontSize={ms(16)}
          fontWeight="bold"
          color={Colors.text}
          ml={ms(10)}
        >
          {river?.riverName}
        </Text>
        <Divider mt={ms(5)} mb={ms(15)} />
        {river?.streamGauges
          ?.sort((a: any, b: any) => `${a.name}`.localeCompare(b.name))
          ?.filter((pegel: any) => !pegel.isStreamGaugeReference)
          ?.map((pegel: any) => renderPegelList(pegel))}
      </Box>
    ))
  }

  const renderEmpty = () => (
    <Text
      fontSize={ms(15)}
      fontWeight="bold"
      textAlign="center"
      color={Colors.text}
      mt={ms(10)}
    >
      No Pegels.
    </Text>
  )

  const onSearchPegel = (val: string) => {
    setSearchedValue(val)
    getVesselPegels(val)
  }

  return (
    <Box flex="1" px={ms(12)} py={ms(15)} bg={Colors.white}>
      <Input
        w={{
          base: '100%'
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
        placeholder="Search for pegels..."
        variant="filled"
        size="sm"
        value={searchedValue}
        onChangeText={e => onSearchPegel(e)}
      />
      <Divider my={ms(15)} />
      <ScrollView
        contentContainerStyle={{flexGrow: 1, paddingBottom: 20}}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
      >
        <HStack mt={ms(10)} alignItems="center" px={ms(10)}>
          <Text
            flex="1"
            fontSize={ms(16)}
            fontWeight="bold"
            color={Colors.text}
          >
            Details
          </Text>
          <Text fontSize={ms(16)} fontWeight="bold" color={Colors.text}>
            Level
          </Text>
        </HStack>
        <Divider mt={ms(5)} mb={ms(15)} />
        {streamGauges?.length === 0 &&
        pegels?.length === 0 &&
        !isInformationLoading
          ? renderEmpty()
          : null}
        {isInformationLoading ? (
          <LoadingIndicator />
        ) : (
          <>
            {renderStreamGauges()}
            {renderPegels()}
          </>
        )}
      </ScrollView>
    </Box>
  )
}

export default Pegels
