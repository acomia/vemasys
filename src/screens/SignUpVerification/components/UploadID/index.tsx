/* eslint-disable react-native/no-inline-styles */
import React from 'react'
import {Box, Button, Divider, Image, Text} from 'native-base'
import {ms} from 'react-native-size-matters'
import {Shadow} from 'react-native-shadow-2'
import {useTranslation} from 'react-i18next'

import {Colors} from '@bluecentury/styles'
import {useUser} from '@bluecentury/stores'

interface IUploadID {
  file: ImageFile | string
  onProceed: () => void
  onUploadNew: () => void
  onOpenCam: () => void
}
export default function UploadID({
  file,
  onProceed,
  onUploadNew,
  onOpenCam,
}: IUploadID) {
  const {t} = useTranslation()
  const {isLoadingUpdateUserInfo, isLoadingSignupRequest} = useUser()
  return (
    <Box bg={Colors.white} flex="1">
      <Box flex="1" p={ms(16)}>
        <Text
          bold
          color={Colors.primary}
          fontSize={ms(18)}
          my={ms(40)}
          textAlign="center"
        >
          {t('uploadCopyOfID')}
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
                {t('identificationCard')}
              </Text>
              <Divider bg={Colors.light} my={ms(10)} />
              <Image
                alt="selfie"
                borderRadius={10}
                h={200}
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
      </Box>
      <Box bg={Colors.white}>
        <Shadow distance={8} viewStyle={{width: '100%'}}>
          <Button
            _text={{
              fontWeight: 'bold',
              fontSize: 16,
            }}
            bg={Colors.primary}
            isLoading={isLoadingUpdateUserInfo || isLoadingSignupRequest}
            isLoadingText="Processing"
            m={ms(16)}
            size="md"
            onPress={onProceed}
          >
            {t('next')}
          </Button>
        </Shadow>
      </Box>
    </Box>
  )
}
