import React, {useEffect} from 'react'
import {Box, FlatList, HStack, Image, Text} from 'native-base'
import {ms} from 'react-native-size-matters'
import {Colors} from '@bluecentury/styles'
import {TouchableOpacity} from 'react-native'
import {Icons} from '@bluecentury/assets'
import {useEntity, useInformation} from '@bluecentury/stores'
import moment from 'moment'
import {LoadingAnimated} from '@bluecentury/components'
import {useNavigation} from '@react-navigation/native'

const TickerOilPrices = () => {
  const navigation = useNavigation()
  const {isInformationLoading, tickerOilPrices, getVesselTickerOilPrices} =
    useInformation()
  const {vesselId} = useEntity()

  useEffect(() => {
    getVesselTickerOilPrices()
  }, [vesselId])

  const entityList = tickerOilPrices && [
    ...new Set(tickerOilPrices.map(x => x.entity.alias)),
  ]
  const tickerOilPrice =
    entityList &&
    entityList.map(e => tickerOilPrices.filter(x => x.entity.alias === e)[0])
  const tickerOilPrice1 =
    entityList &&
    entityList.map(e => tickerOilPrices.filter(x => x.entity.alias === e)[1])

  console.log('price 1', tickerOilPrice)
  console.log('price 2', tickerOilPrice1)

  const renderItem = ({item, index}: any) => {
    return (
      <TouchableOpacity
        key={`OilPrice-${index}`}
        activeOpacity={0.7}
        onPress={() => navigation.navigate('TickerOilPriceDetails')}
      >
        <Box
          bg={Colors.white}
          borderRadius={ms(5)}
          borderWidth={1}
          borderColor={Colors.border}
          mt={ms(10)}
          shadow={1}
        >
          <HStack
            backgroundColor={Colors.border}
            px={ms(16)}
            py={ms(10)}
            alignItems="center"
          >
            <Text
              flex={1}
              color={Colors.azure}
              fontWeight="bold"
              fontSize={ms(16)}
            >
              {item?.entity?.alias}
            </Text>
          </HStack>
          <HStack
            px={ms(14)}
            py={ms(15)}
            alignItems="center"
            justifyContent="space-between"
          >
            <Box>
              <Text color={Colors.disabled} fontWeight="medium">
                Date
              </Text>
              <Text color={Colors.text} fontWeight="bold">
                {moment(item?.date).format('DD MMM YYYY')}
              </Text>
            </Box>
            <Box>
              <Text color={Colors.disabled} fontWeight="medium">
                Price
              </Text>
              <Text
                color={
                  tickerOilPrice[index].price < tickerOilPrice1[index].price
                    ? Colors.secondary
                    : Colors.danger
                }
                fontWeight="bold"
              >
                {item?.price}
              </Text>
            </Box>
            <Image
              alt="Price-chart-line"
              source={
                tickerOilPrice[index].price < tickerOilPrice1[index].price
                  ? Icons.chart__line_down
                  : Icons.chart_line_up
              }
            />
          </HStack>
        </Box>
      </TouchableOpacity>
    )
  }

  return (
    <Box flex="1" bg={Colors.white} px={ms(12)} py={ms(20)}>
      <Text fontWeight="bold" fontSize={ms(20)} color={Colors.azure}>
        Ticker oil prices
      </Text>

      {isInformationLoading ? (
        <LoadingAnimated />
      ) : (
        <FlatList
          data={tickerOilPrice}
          renderItem={renderItem}
          keyExtractor={(item: any) => `TickerOil-${item.id}`}
        />
      )}
    </Box>
  )
}

export default TickerOilPrices
