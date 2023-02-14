import React from 'react'

import { Box, Text, View } from 'native-base'
import { ms } from 'react-native-size-matters'
import { Dimensions } from "react-native";
import Svg, { G, Rect } from "react-native-svg";
import {useTranslation} from 'react-i18next'

export const NavLogDivider = () => {
  const {t} = useTranslation()
  const { width } = Dimensions.get("screen");
  const spacing = 16;
  const dashes = new Array(Math.floor(width / spacing)).fill(null);

  const dashText = () => {
    return (
      <Svg height="11" width="100%">
        <G>
          {dashes.map((_, index) => (
            <Rect
              key={index}
              x="5"
              y="8"
              width="8"
              height="3"
              fill="#6BBF87"
              translateX={spacing * index}
            />
          ))}
        </G>
      </Svg>
    )
  }

  return (
    <Box 
      mt={-3}
      pt={3}
      px={ms(14)}
      py={ms(10)}
      style={{
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
      }}
      >
        {dashText()}
          <Text
            style={{
              backgroundColor: '#6BBF87',
              padding: 10,
              borderRadius: 5,
            }} 
          >
              {t('nowToday')}
          </Text>
        {dashText()}
    </Box>
  )
}

export default NavLogDivider
