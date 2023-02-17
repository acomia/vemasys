import React from 'react'

import {Box, Text, HStack} from 'native-base'
import {ms} from 'react-native-size-matters'
import {Dimensions} from 'react-native'
import Svg, {G, Rect} from 'react-native-svg'
import {useTranslation} from 'react-i18next'

export const NavLogDivider = () => {
  const {t} = useTranslation()
  const {width} = Dimensions.get('screen')
  const spacing = 16
  const dashes = new Array(Math.floor(width / spacing)).fill(null)

  const dashText = () => {
    return (
      <Svg height="11" width={'100%'}>
        <G>
          {dashes.map((_, index) => (
            <Rect
              key={index}
              fill="#6BBF87"
              height="3"
              translateX={spacing * index}
              width="8"
              x="5"
              y="8"
            />
          ))}
        </G>
      </Svg>
    )
  }

  return (
    <HStack
      style={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
      }}
      mt={-3}
      pt={3}
      px={ms(14)}
      py={ms(10)}
    >
      <Box width={ms(110)}>{dashText()}</Box>
      <Text
        style={{
          backgroundColor: '#6BBF87',
          borderRadius: 5,
        }}
        px={5}
        py={1}
      >
        {t('nowToday')}
      </Text>
      <Box width={ms(127)}>{dashText()}</Box>
    </HStack>
  )
}

export default NavLogDivider
