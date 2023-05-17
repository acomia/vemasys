/* eslint-disable react-native/no-inline-styles */
import React from 'react'
import {Box, Button, Divider, Image, ScrollView, Text} from 'native-base'
import {ms} from 'react-native-size-matters'
import {Shadow} from 'react-native-shadow-2'
import {useTranslation} from 'react-i18next'

import {Colors} from '@bluecentury/styles'
import {useUser} from '@bluecentury/stores'

interface IUploadID {
  file: ImageFile | string
  onFinish: () => void
  onUploadNew: () => void
  onOpenCam: () => void
}
export default function UploadDocs({
  file,
  onFinish,
  onUploadNew,
  onOpenCam,
}: IUploadID) {
  const {t} = useTranslation()
  const {isLoadingSignupRequest} = useUser()
  return (
    <Box bg={Colors.white} flex="1">
      <ScrollView
        contentContainerStyle={{flexGrow: 1, padding: ms(16)}}
        showsVerticalScrollIndicator={false}
      >
        <Text
          bold
          color={Colors.primary}
          fontSize={ms(18)}
          my={ms(40)}
          textAlign="center"
        >
          {t('uploadProofOfVesselOwnership')}
        </Text>
        {file !== '' ? (
          <Shadow
            corners={['bottomLeft', 'bottomRight']}
            distance={5}
            sides={['bottom', 'right']}
            viewStyle={{width: '100%', borderRadius: 5}}
          >
            <Box
              borderColor={Colors.light}
              borderRadius={5}
              borderWidth={1}
              px={ms(14)}
              py={ms(10)}
            >
              <Text bold color={Colors.text} fontSize={16}>
                {t('identificationDocument')}
              </Text>
              <Divider bg={Colors.light} my={ms(10)} />
              <Image
                alt="selfie"
                h={250}
                mb={ms(10)}
                resizeMode="contain"
                source={{uri: file.uri}}
                w="100%"
              />
            </Box>
          </Shadow>
        ) : null}
        <Button
          _text={{
            fontWeight: 'bold',
            fontSize: 16,
            color: Colors.primary,
          }}
          bg={Colors.light}
          mt={ms(30)}
          size="md"
          onPress={onUploadNew}
        >
          {t('uploadNew')}
        </Button>
        <Button
          _text={{
            fontWeight: 'bold',
            fontSize: 16,
            color: Colors.primary,
          }}
          bg={Colors.light}
          mt={ms(15)}
          size="md"
          onPress={onOpenCam}
        >
          {t('openCamera')}
        </Button>
      </ScrollView>
      <Box bg={Colors.white}>
        <Shadow distance={8} viewStyle={{width: '100%'}}>
          <Button
            _spinner={{
              color: Colors.white,
            }}
            _text={{
              fontWeight: 'bold',
              fontSize: 16,
            }}
            bg={Colors.primary}
            isLoading={isLoadingSignupRequest}
            isLoadingText="Creating request..."
            m={ms(16)}
            size="md"
            onPress={onFinish}
          >
            {t('finish')}
          </Button>
        </Shadow>
      </Box>
    </Box>
  )
}
