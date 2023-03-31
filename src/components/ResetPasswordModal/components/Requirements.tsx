import React from 'react'
import {Text, VStack, HStack} from 'native-base'
import {useTranslation} from 'react-i18next'
import IconIon from 'react-native-vector-icons/Ionicons'
import {ms} from 'react-native-size-matters'
import {Colors} from '@bluecentury/styles'

const Requirements = () => {
  const {t} = useTranslation()

  const passwordTexts = [
    t('requirementHeader'),
    t('requirementSub1'),
    t('requirementSub2'),
    t('requirementSub3'),
  ]

  return (
    <HStack
      backgroundColor={Colors.navLogItemBlue}
      borderRadius={5}
      padding={ms(5)}
      space={ms(10)}
    >
      <IconIon name="information-circle-outline" size={ms(20)} />
      <VStack>
        {passwordTexts?.map((passwordText, index) => {
          return (
            <Text key={index} color={Colors.dark_blue}>
              {passwordText}
            </Text>
          )
        })}
      </VStack>
    </HStack>
  )
}

export default Requirements
