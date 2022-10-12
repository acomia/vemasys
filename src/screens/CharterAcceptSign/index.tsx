import React, {useEffect, useRef, useState} from 'react'
import {
  Box,
  Button,
  Flex,
  HStack,
  Image,
  ScrollView,
  Switch,
  Text,
  useToast,
} from 'native-base'
import {Colors} from '@bluecentury/styles'
import {ms} from 'react-native-size-matters'
import {Animated, Icons} from '@bluecentury/assets'
import Signature, {SignatureViewRef} from 'react-native-signature-canvas'
import {Shadow} from 'react-native-shadow-2'
import {NativeStackScreenProps} from '@react-navigation/native-stack'
import {useCharters, useEntity, useSettings} from '@bluecentury/stores'
import {
  CHARTER_CONTRACTOR_STATUS_ACCEPTED,
  UPDATE_CHARTER_FAILED,
  UPDATE_CHARTER_SUCCESS,
  UPLOAD_CHARTER_SIGNATURE_FAILED,
  UPLOAD_CHARTER_SIGNATURE_SUCCESS,
} from '@bluecentury/constants'
import {LoadingAnimated} from '@bluecentury/components'

type Props = NativeStackScreenProps<RootStackParamList>
const CharterAcceptSign = ({navigation, route}: Props) => {
  const {charter} = route.params
  const ref = useRef<SignatureViewRef>(null)
  const toast = useToast()
  const {
    isCharterLoading,
    updateCharterStatus,
    getCharters,
    uploadSignature,
    updateCharterStatusResponse,
    uploadCharterSignatureResponse,
    resetResponses,
  } = useCharters()
  const {user} = useEntity()
  const {isMobileTracking, setIsMobileTracking} = useSettings()
  const [scrollEnabled, setScrollEnabled] = useState(true)
  const [mobileTracker, setMobileTracker] = useState(false)
  const [sign, setSign] = useState(null)

  useEffect(() => {
    if (updateCharterStatusResponse === UPDATE_CHARTER_SUCCESS) {
      const signData = {
        user: user.id,
        signature: sign,
        signedDate: new Date().toLocaleDateString(),
        charter: charter.id,
      }
      uploadSignature(signData)
      if (!isMobileTracking && mobileTracker) {
        setIsMobileTracking(mobileTracker)
      }
      showToast('Charter accepted sucessfully.', 'success')
    } else {
      if (updateCharterStatusResponse === UPDATE_CHARTER_FAILED) {
        showToast('Charter accepted failed.', 'failed')
      }
    }
  }, [updateCharterStatusResponse])

  useEffect(() => {
    if (uploadCharterSignatureResponse === UPLOAD_CHARTER_SIGNATURE_SUCCESS) {
      showToast('Charter signature uploaded.', 'success')
      navigation.goBack()
    } else {
      if (uploadCharterSignatureResponse === UPLOAD_CHARTER_SIGNATURE_FAILED) {
        showToast('Charter signature upload failed.', 'failed')
      }
    }
  }, [uploadCharterSignatureResponse])

  const handleSignature = signature => {
    const status = {
      status: CHARTER_CONTRACTOR_STATUS_ACCEPTED,
      setContractorStatus: true,
    }
    setSign(signature)
    updateCharterStatus(charter?.id, status)
  }

  const handleEmpty = () => {
    showToast('Please sign before accepting.', 'warning')
  }

  const handleClear = () => {
    ref.current?.clearSignature()
  }

  const handleOnAcceptAndSign = () => {
    ref.current?.readSignature()
  }

  const style = `.m-signature-pad--footer {display: none; margin: 0px;}
                .m-signature-pad {border-radius: 10px; border: 1px solid #E6E6E6;}
                body {height: 180px;}`

  const showToast = (text: string, res: string) => {
    toast.show({
      duration: 2000,
      render: () => {
        return (
          <Text
            bg={res === 'success' ? 'emerald.500' : 'red.500'}
            px="2"
            py="1"
            rounded="sm"
            mb={5}
            color={Colors.white}
          >
            {text}
          </Text>
        )
      },
      onCloseComplete() {
        res === 'success' ? onSuccess() : null
      },
    })
  }

  const onSuccess = () => {
    resetResponses()
  }

  if (isCharterLoading) return <LoadingAnimated />

  return (
    <Box flex="1">
      <ScrollView
        contentContainerStyle={{flexGrow: 1, paddingBottom: 30}}
        backgroundColor={Colors.white}
        borderTopLeftRadius={ms(15)}
        borderTopRightRadius={ms(15)}
        p={ms(12)}
        scrollEnabled={scrollEnabled}
      >
        <Image
          alt="Charter-Signature"
          source={Animated.signature}
          style={{
            width: 280,
            height: 280,
            alignSelf: 'center',
          }}
          resizeMode="contain"
        />
        <Signature
          ref={ref}
          onOK={handleSignature}
          onEmpty={handleEmpty}
          onBegin={() => setScrollEnabled(false)}
          onEnd={() => setScrollEnabled(true)}
          webStyle={style}
        />

        <Text fontWeight="medium" color={Colors.disabled} mt={ms(20)}>
          By signing this document with an electronic signature, I agree that
          such signature will be valid as handwritten signatures to the extent
          allowed by law.
        </Text>
      </ScrollView>

      <Box bg={Colors.white} position="relative">
        <Shadow
          distance={25}
          viewStyle={{
            width: '100%',
          }}
        >
          <Box>
            <HStack
              bg={Colors.white}
              borderRadius={5}
              justifyContent="space-between"
              alignItems="center"
              px={ms(12)}
              py={ms(7)}
              mx={ms(12)}
              mt={ms(12)}
              borderWidth={1}
              borderColor={Colors.light}
            >
              <Image
                alt="my-location"
                source={Icons.location_alt}
                mr={ms(10)}
                width={ms(20)}
                height={ms(20)}
              />
              <Text flex={1} fontWeight="medium">
                Activate tracking
              </Text>
              <Switch
                size="sm"
                value={mobileTracker}
                onToggle={() => setMobileTracker(!mobileTracker)}
              />
            </HStack>
            <HStack p={ms(14)}>
              <Button
                flex="1"
                // m={ms(16)}
                variant="ghost"
                colorScheme="muted"
                onPress={handleClear}
              >
                Clear
              </Button>
              <Button
                flex="1"
                // m={ms(16)}
                bg={Colors.primary}
                onPress={handleOnAcceptAndSign}
              >
                Accept and sign
              </Button>
            </HStack>
          </Box>
        </Shadow>
      </Box>
    </Box>
  )
}

export default CharterAcceptSign
