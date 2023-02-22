import React, {useRef, useState} from 'react'
import {
  Box,
  Button,
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
  UPDATE_CHARTER_SUCCESS,
} from '@bluecentury/constants'
import {LoadingAnimated, NoInternetConnectionMessage} from '@bluecentury/components'
import {useTranslation} from 'react-i18next'

type Props = NativeStackScreenProps<RootStackParamList, 'CharterAcceptSign'>
const CharterAcceptSign = ({navigation, route}: Props) => {
  const {t} = useTranslation()
  const {charter, setSignature, onCharterSelected} = route.params
  const ref = useRef<SignatureViewRef>(null)
  const toast = useToast()
  const {
    isCharterLoading,
    updateCharterStatus,
    getCharters,
    uploadSignature,
    setSignatureId,
  } = useCharters()

  const {user} = useEntity()
  const {isMobileTracking, setIsMobileTracking} = useSettings()
  const [scrollEnabled, setScrollEnabled] = useState(true)
  const [mobileTracker, setMobileTracker] = useState(false)
  const [sign, setSign] = useState<StringOrNull>(null)

  const handleSignature = async signature => {
    const status = {
      status: CHARTER_CONTRACTOR_STATUS_ACCEPTED,
      setContractorStatus: true,
    }
    setSign(signature)
    updateCharterStatus(charter?.id, status)
    const update = await updateCharterStatus(charter?.id, status)
    if (update === UPDATE_CHARTER_SUCCESS) {
      getCharters()
      showToast('Charter accepted sucessfully.', 'success')
    } else {
      showToast('Charter accepted failed.', 'failed')
    }
    const signData = {
      user: user?.id,
      signature: signature,
      signedDate: new Date().toLocaleDateString(),
      charter: charter.id,
    }
    const sign = await uploadSignature(signData)
    if (typeof sign === 'object') {
      showToast('Signature upload sucessfully.', 'success')
      setSignatureId(sign.id)
      setSignature(signature.replace('data:image/png;base64,', ''))
    } else {
      showToast('Signature upload failed.', 'failed')
    }
  }

  const handleOnValueChange = () => {
    navigation.navigate('TrackingServiceDialog')
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
        //TODO not just goBack but automatically open modal with pdf in edit mode, pass there a signature
        res === 'success' ? navigation.goBack() : null
        onCharterSelected(charter)
        // res === 'success' ? resetResponses() : null
      },
    })
  }

  if (isCharterLoading) return <LoadingAnimated />

  return (
    <Box flex="1">
      <NoInternetConnectionMessage />
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
          {t('signatureDescription')}
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
                {t('activateTracking')}
              </Text>
              <Switch
                size="sm"
                value={isMobileTracking}
                onToggle={handleOnValueChange}
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
                {t('clear')}
              </Button>
              <Button
                flex="1"
                // m={ms(16)}
                bg={Colors.primary}
                onPress={handleOnAcceptAndSign}
              >
                {t('acceptAndSign')}
              </Button>
            </HStack>
          </Box>
        </Shadow>
      </Box>
    </Box>
  )
}

export default CharterAcceptSign
