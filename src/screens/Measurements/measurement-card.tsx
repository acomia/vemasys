import React from 'react'
import {Box, HStack, Text} from 'native-base'
import {ms} from 'react-native-size-matters'
import moment from 'moment-timezone'
import {Colors} from '@bluecentury/styles'
import {formatNumber} from '@bluecentury/constants'
import {LastMeasurement} from '@bluecentury/models'

type Props = {
  item: LastMeasurement
  index: number
  routeFrom: string
}

export const MeasurementCard = ({item, index, routeFrom}: Props) => {
  return (
    <Box
      key={index}
      bg={Colors.white}
      borderColor={Colors.light}
      borderRadius={ms(5)}
      borderWidth={1}
      mb={ms(7)}
      px={ms(14)}
      py={ms(12)}
      shadow={2}
    >
      <HStack alignItems="center">
        <Box flex="1">
          <Text color={Colors.text} fontWeight="medium">
            {item?.user?.firstname} {item?.user?.lastname}
          </Text>
          <Text color={Colors.disabled}>
            {moment(item?.date).format('DD MMM YYYY - hh:mm A')}
          </Text>
        </Box>
        <Text bold color={Colors.highlighted_text}>
          {formatNumber(item?.value, 2, ' ')}{' '}
          {routeFrom === 'reservoir' ? 'L' : 'h'}
        </Text>
      </HStack>
    </Box>
  )
}
