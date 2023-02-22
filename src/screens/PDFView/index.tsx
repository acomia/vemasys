import React from 'react'
import {StyleSheet, Dimensions, View} from 'react-native'
import Pdf from 'react-native-pdf'
import {NativeStackScreenProps} from '@react-navigation/native-stack'
import {Box} from 'native-base'
import {ms} from 'react-native-size-matters'

import {useCharters} from '@bluecentury/stores'
import {NoInternetConnectionMessage} from '@bluecentury/components'

type Props = NativeStackScreenProps<RootStackParamList>
export default function PDFView({route}: Props) {
  const {pdfPath} = useCharters()
  const {path}: any = route.params

  const source = {uri: path, cache: true}

  return (
    <Box flex="1" justifyContent="flex-start" alignItems="center" mt={ms(20)}>
      <NoInternetConnectionMessage />
      <Pdf
        source={source}
        onLoadComplete={(numberOfPages, filePath) => {
          console.log(`Number of pages: ${numberOfPages}`)
        }}
        onPageChanged={(page, numberOfPages) => {
          console.log(`Current page: ${page}`)
        }}
        onError={error => {
          console.log(error)
        }}
        onPressLink={uri => {
          console.log(`Link pressed: ${uri}`)
        }}
        style={styles.pdf}
        enablePaging
        trustAllCerts={false}
      />
    </Box>
  )
}

const styles = StyleSheet.create({
  pdf: {
    flex: 1,
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height
  }
})
