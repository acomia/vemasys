import React from 'react'
import {Box, ScrollView, Text} from 'native-base'
import {Dimensions} from 'react-native'
import {LineChart} from 'react-native-chart-kit'
import {Colors} from '@bluecentury/styles'
import {ms} from 'react-native-size-matters'
import {useInformation} from '@bluecentury/stores'
import moment from 'moment'

const TickerOilPriceDetails = () => {
  const {tickerOilPrices} = useInformation()

  const entityList = tickerOilPrices && [
    ...new Set(tickerOilPrices.map(x => x.entity.alias))
  ]

  const chartConfig = {
    backgroundGradientFrom: Colors.white,
    backgroundGradientTo: Colors.white,
    color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    propsForDots: {
      r: '6',
      strokeWidth: '2',
      stroke: Colors.primary
    },
    barPercentage: 0.5,
    useShadowColorFromDataset: false
  }
  return (
    <Box flex="1">
      <ScrollView
        contentContainerStyle={{flexGrow: 1, paddingBottom: 20}}
        bg={Colors.white}
        py={ms(20)}
      >
        {entityList?.map((chart, index) => (
          <Box key={`OilPriceChart-${index}`}>
            <Text
              fontWeight="bold"
              color={Colors.azure}
              textAlign="center"
              mb={ms(20)}
            >{`${chart} (Price in EUR)`}</Text>
            <LineChart
              data={{
                labels: tickerOilPrices
                  .filter(x => x.entity.alias === chart)
                  .map(x => moment(x.date).format('MMM D'))
                  .reverse(),
                datasets: [
                  {
                    data: tickerOilPrices
                      .filter(x => x.entity.alias === chart)
                      .map(x => x.price)
                      .reverse(),
                    color: (opacity = 1) => `rgba(68, 167, 185, ${opacity})`,
                    strokeWidth: 2
                  }
                ]
              }}
              width={Dimensions.get('window').width} // from react-native
              height={400}
              yAxisLabel="€"
              chartConfig={chartConfig}
              bezier
              style={{
                borderRadius: 10
              }}
              xLabelsOffset={20}
              verticalLabelRotation={-45}
              segments={10}
            />
          </Box>
        ))}
      </ScrollView>
    </Box>
  )
}

export default TickerOilPriceDetails
