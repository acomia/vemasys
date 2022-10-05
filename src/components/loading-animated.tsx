import React from 'react'
import Lottie from 'lottie-react-native'
import {Box} from 'native-base'
import {IComboBoxProps} from 'native-base/lib/typescript/components/composites/Typeahead/types'

export function LoadingAnimated(props: IComboBoxProps) {
  return (
    <Box size="32" alignSelf="center" {...props}>
      <Lottie
        autoPlay
        loop
        source={require('@bluecentury/assets/animated/lottie/loading.json')}
      />
    </Box>
  )
}
