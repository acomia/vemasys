import React from 'react'
import Lottie from 'lottie-react-native'
import {Box} from 'native-base'
import {IComboBoxProps} from 'native-base/lib/typescript/components/composites/Typeahead/types'

export function LoadingAnimated(props: Partial<IComboBoxProps>) {
  return (
    <Box alignSelf="center" size="32" {...props}>
      <Lottie
        autoPlay
        loop
        source={require('@bluecentury/assets/animated/lottie/loading.json')}
      />
    </Box>
  )
}
