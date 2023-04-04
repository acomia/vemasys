import React, {useRef, useState, useEffect} from 'react'
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
import {CHARTER_CONTRACTOR_STATUS_ACCEPTED} from '@bluecentury/constants'
import {
  LoadingAnimated,
  NoInternetConnectionMessage,
} from '@bluecentury/components'
import {useTranslation} from 'react-i18next'
import {RootStackParamList} from '@bluecentury/types/nav.types'
import Pdf from 'react-native-pdf'
import {StyleSheet} from 'react-native'

type Props = NativeStackScreenProps<RootStackParamList, 'CharterAcceptSign'>
const CharterAcceptSign = ({navigation, route}: Props) => {
  const {t} = useTranslation()
  const {charter, onCharterSelected, handleSingleTap, path} =
    route.params
  const ref = useRef<SignatureViewRef>(null)
  const toast = useToast()
  const {
    isCharterLoading,
    uploadSignature,
    setSignatureId,
    setIsDocumentSigning,
    isDocumentSigning,
  } = useCharters()

  const {user} = useEntity()
  const {isMobileTracking} = useSettings()
  const [scrollEnabled, setScrollEnabled] = useState(true)
  // const [sign, setSign] = useState<StringOrNull>(null)
  const [signat, setSignat] = useState('')
  const [coords, setCoords] = useState({})
  const [pageWidth, setPageWidth] = useState(0)
  const [pageHeight, setPageHeight] = useState(0)

  useEffect(() => {
    console.log('SIGNAT_STATE', signat)
  }, [signat])

  useEffect(() => {
    console.log('COORDS', coords)
  }, [coords])

  const handleSignature = async signature => {
    setIsDocumentSigning(true)
    console.log('SIGN_HANDLE_ARG', signature)
    setSignat(signature.replace('data:image/png;base64,', ''))
    const status = {
      status: CHARTER_CONTRACTOR_STATUS_ACCEPTED,
      setContractorStatus: true,
    }
    // setSign(signature)
    const signData = {
      user: user?.id,
      signature: signature,
      signedDate: new Date().toLocaleDateString(),
      charter: charter.id,
    }
    const sign = await uploadSignature(signData)
    if (typeof sign === 'object') {
      setSignatureId(sign.id)
      onCharterSelected(charter)
      handleSingleTap(
        1,
        coords.x,
        coords.y,
        signature.replace('data:image/png;base64,', ''),
        pageWidth,
        pageHeight
      )
      showToast('Signature upload successfully.', 'success')
      navigation.goBack()
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
                body {height: 150px;}`

  const showToast = (text: string, res: string) => {
    toast.show({
      duration: 2000,
      render: () => {
        return (
          <Text
            bg={res === 'success' ? 'emerald.500' : 'red.500'}
            color={Colors.white}
            mb={5}
            px="2"
            py="1"
            rounded="sm"
          >
            {text}
          </Text>
        )
      },
      // onCloseComplete() {
      //   //TODO not just goBack but automatically open modal with pdf in edit mode, pass there a signature
      //   res === 'success' ? navigation.goBack() : null
      // },
    })
  }

  if (isDocumentSigning) {
    return (
      <Image
        style={{
          width: '100%',
          height: '100%',
          alignSelf: 'center',
        }}
        alt="Charter-Signature"
        resizeMode="contain"
        source={Animated.signature}
      />
    )
  }

  // if (isCharterLoading && !isDocumentSigning) return <LoadingAnimated />

  return (
    <Box flex="1">
      <NoInternetConnectionMessage />
      <Box style={{height: '40%'}}>
        <Pdf
          // enablePaging
          // fitPolicy={0}
          // singlePage={true}
          source={{uri: path, cache: true}}
          style={styles.pdf}
          trustAllCerts={false}
          onError={error => {
            console.log(error)
          }}
          onLoadComplete={(numberOfPages, filePath, {width, height}) => {
            console.log(`Number of pages: ${numberOfPages}`)
            setPageWidth(width)
            setPageHeight(height)
          }}
          onPageChanged={(page, numberOfPages) => {
            console.log(`Current page: ${page}`)
          }}
          onPageSingleTap={(page, x, y) => {
            setCoords({x: x, y: y})
          }}
          onPressLink={uri => {
            console.log(`Link pressed: ${uri}`)
          }}
        />
      </Box>
      <ScrollView
        backgroundColor={Colors.white}
        borderTopLeftRadius={ms(15)}
        borderTopRightRadius={ms(15)}
        contentContainerStyle={{flexGrow: 3, paddingBottom: 30}}
        h="1%"
        p={ms(12)}
        scrollEnabled={scrollEnabled}
      >
        <Signature
          ref={ref}
          webStyle={style}
          onBegin={() => setScrollEnabled(false)}
          onEmpty={handleEmpty}
          onEnd={() => setScrollEnabled(true)}
          onOK={handleSignature}
        />

        <Text color={Colors.disabled} fontWeight="medium" mt={ms(5)}>
          {t('signatureDescription')}
        </Text>
      </ScrollView>

      <Box bg={Colors.white} position="relative">
        <Shadow
          viewStyle={{
            width: '100%',
          }}
          distance={25}
        >
          <Box>
            <HStack
              alignItems="center"
              bg={Colors.white}
              borderColor={Colors.light}
              borderRadius={5}
              borderWidth={1}
              justifyContent="space-between"
              mt={ms(12)}
              mx={ms(12)}
              px={ms(12)}
              py={ms(7)}
            >
              <Image
                alt="my-location"
                height={ms(20)}
                mr={ms(10)}
                source={Icons.location_alt}
                width={ms(20)}
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
                colorScheme="muted"
                flex="1"
                variant="ghost"
                onPress={handleClear}
              >
                {t('clear')}
              </Button>
              <Button
                bg={Colors.primary}
                flex="1"
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

const styles = StyleSheet.create({
  pdf: {
    flex: 1,
    width: '100%',
    height: 400,
    backgroundColor: '#23272F',
    justifyContent: 'center',
    // paddingHorizontal: 12,
    // marginBottom: Platform.OS === 'ios' ? 0 : 40,
  },
})
