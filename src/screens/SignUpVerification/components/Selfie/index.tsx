import React, {useRef, useState} from 'react'
import {StyleSheet} from 'react-native'
import {Box, Button, HStack, Icon, Image, Text} from 'native-base'
import {RNCamera} from 'react-native-camera'
import {Colors} from '@bluecentury/styles'
import {ms} from 'react-native-size-matters'
import Fontisto from 'react-native-vector-icons/Fontisto'

interface ISelfie {
  onProceed: () => void
}
export default function Selfie({onProceed}: ISelfie) {
  const camRef = useRef<RNCamera>(null)
  const [imgFile, setImgFile] = useState<ImageFile | string>('')
  const [snapLoading, setSnapLoading] = useState(false)

  const takePicture = async () => {
    setSnapLoading(true)
    if (camRef) {
      const options = {quality: 0.5, base64: true, width: 1024}
      const data = await camRef?.current?.takePictureAsync(options)
      const arrFromPath = data.uri.split('/')
      const fileName = arrFromPath[arrFromPath.length - 1]
      const fileNameWithoutExtension = fileName.split('.')[0]
      setImgFile({
        id: fileNameWithoutExtension,
        uri: data.uri,
        fileName: fileName,
        type: 'image/jpeg',
      })
      setSnapLoading(false)
    }
  }

  return (
    <Box bg={Colors.white} flex="1">
      {imgFile !== '' ? (
        <Box flex="1">
          <Image
            alt="selfie"
            h="100%"
            resizeMode="contain"
            source={{uri: imgFile.uri}}
            w="100%"
          />
        </Box>
      ) : (
        <RNCamera
          ref={camRef}
          androidCameraPermissionOptions={{
            title: 'Permission to use camera',
            message: 'We need your permission to use your camera',
            buttonPositive: 'Ok',
            buttonNegative: 'Cancel',
          }}
          captureAudio={false}
          flashMode={RNCamera.Constants.FlashMode.on}
          style={styles.preview}
          type={RNCamera.Constants.Type.front}
        >
          {snapLoading ? (
            <Text bold color={Colors.white} fontSize={20}>
              Processing...
            </Text>
          ) : null}
        </RNCamera>
      )}

      {imgFile !== '' ? (
        <HStack>
          <Button
            _text={{
              fontWeight: 'bold',
              fontSize: 16,
            }}
            bg={Colors.primary}
            endIcon={<Icon as={Fontisto} name="undo" size="md" />}
            flex="1"
            m={ms(10)}
            size="md"
            onPress={() => setImgFile('')}
          >
            Retake
          </Button>

          <Button
            _text={{
              fontWeight: 'bold',
              fontSize: 16,
            }}
            bg={Colors.primary}
            // endIcon={<Icon as={Fontisto} name="arrow-right-l" size="md" />}
            flex="1"
            m={ms(10)}
            size="md"
            onPress={onProceed}
          >
            Next
          </Button>
        </HStack>
      ) : (
        <Box>
          <Button
            _text={{
              fontWeight: 'bold',
              fontSize: 16,
            }}
            bg={Colors.primary}
            disabled={snapLoading}
            m={ms(16)}
            size="md"
            onPress={takePicture}
          >
            Take picture
          </Button>
        </Box>
      )}
    </Box>
  )
}

const styles = StyleSheet.create({
  preview: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
})
