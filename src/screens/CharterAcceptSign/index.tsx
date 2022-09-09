import React, {useRef, useState} from 'react'
import {
  Box,
  Button,
  Flex,
  HStack,
  Image,
  ScrollView,
  Text,
  useToast
} from 'native-base'
import {Colors} from '@bluecentury/styles'
import {ms} from 'react-native-size-matters'
import {Animated} from '@bluecentury/assets'
import Signature, {SignatureViewRef} from 'react-native-signature-canvas'
import {Shadow} from 'react-native-shadow-2'
import {NativeStackScreenProps} from '@react-navigation/native-stack'
import {useCharters} from '@bluecentury/stores'
import {CHARTER_CONTRACTOR_STATUS_ACCEPTED} from '@bluecentury/constants'
import {LoadingIndicator} from '@bluecentury/components'

type Props = NativeStackScreenProps<RootStackParamList>
const CharterAcceptSign = ({navigation, route}: Props) => {
  const {charter} = route.params
  const ref = useRef<SignatureViewRef>(null)
  const toast = useToast()
  const {isCharterLoading, updateCharterStatus, getCharters} = useCharters()
  const [scrollEnabled, setScrollEnabled] = useState(true)

  const handleSignature = async signature => {
    console.log(signature)
    const status = {
      status: CHARTER_CONTRACTOR_STATUS_ACCEPTED,
      setContractorStatus: true
    }
    const update = await updateCharterStatus(charter?.id, status)
    if (typeof update === 'string') {
      getCharters()
      showToast('Charter accepted sucessfully.', 'success')
    } else {
      showToast('Charter accepted failed.', 'failed')
    }
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
      duration: 1000,
      render: () => {
        return (
          <Text
            bg={
              res === 'success'
                ? 'emerald.500'
                : 'warning'
                ? 'warning.400'
                : 'red.500'
            }
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
        res === 'success' ? navigation.goBack() : null
      }
    })
  }

  if (isCharterLoading) return <LoadingIndicator />

  return (
    <Box flex={1}>
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
            alignSelf: 'center'
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
            width: '100%'
          }}
        >
          <HStack>
            <Button
              flex="1"
              m={ms(16)}
              variant="ghost"
              colorScheme="muted"
              onPress={handleClear}
            >
              Clear
            </Button>
            <Button
              flex="1"
              m={ms(16)}
              bg={Colors.primary}
              onPress={handleOnAcceptAndSign}
            >
              Accept and sign
            </Button>
          </HStack>
        </Shadow>
      </Box>
    </Box>
  )
}

export default CharterAcceptSign
