import React from 'react'
import ImageViewer from 'react-native-image-zoom-viewer'
import {NativeStackScreenProps} from '@react-navigation/native-stack'

type Props = NativeStackScreenProps<RootStackParamList>
const ImgViewer = ({route}: Props) => {
  const {url} = route.params

  const imgSource = [
    {
      url
    }
  ]
  return <ImageViewer imageUrls={imgSource} renderIndicator={() => <></>} />
}

export default ImgViewer
