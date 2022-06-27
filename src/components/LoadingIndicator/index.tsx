import React, {FC} from 'react'
import {Center, Image} from 'native-base'
import {ms} from 'react-native-size-matters'

import {Animated} from '@bluecentury/assets'

interface IProps {
  width?: number
  height?: number
}

export const LoadingIndicator: FC<IProps> = ({width, height}) => {
  const i_width: number = width ?? 100
  const i_height: number = height ?? 100

  return (
    <Center>
      <Image
        alt="vemasys-loading"
        source={Animated.vemasys_loading}
        width={ms(i_width)}
        height={ms(i_height)}
        resizeMode="contain"
      />
    </Center>
  )
}
