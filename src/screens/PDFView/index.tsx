import React from 'react'
import {StyleSheet, Dimensions, View} from 'react-native'
import Pdf from 'react-native-pdf'

import {useCharters} from '@bluecentury/stores'
import {VEMASYS_PRODUCTION_FILE_URL} from '@bluecentury/constants'

export default function PDFView() {
  const {pdfPath} = useCharters()
  // console.log('path', `${VEMASYS_PRODUCTION_FILE_URL}/${pdfPath}`)

  const source = {uri: `${VEMASYS_PRODUCTION_FILE_URL}/${pdfPath}`, cache: true}

  return (
    <View style={styles.container}>
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
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginTop: 25
  },
  pdf: {
    flex: 1,
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height
  }
})
