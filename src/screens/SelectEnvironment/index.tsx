import React from 'react'
import {Box, Text, Button, Divider, VStack} from 'native-base'
import {Colors} from '@bluecentury/styles'
import {useSettings} from '@bluecentury/stores'
import {CommonActions, useNavigation} from '@react-navigation/native'

export default function SelectEnvironment() {
  const navigation = useNavigation()
  const setEnv = useSettings.getState().setEnv
  const handleOnPressUAT = () => {
    setEnv('UAT')
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{name: 'Splash'}]
      })
    )
  }
  const handleOnPressProduction = () => {
    setEnv('PROD')
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{name: 'Splash'}]
      })
    )
  }
  return (
    <Box flex={1} bgColor={Colors.white} p={5} safeArea>
      <Text fontSize="xl">Select Environment</Text>
      <Divider />
      <VStack space={2} mt={5}>
        <Button colorScheme="indigo" onPress={handleOnPressUAT}>
          UAT
        </Button>
        <Button colorScheme="lime" onPress={handleOnPressProduction}>
          Production
        </Button>
      </VStack>
    </Box>
  )
}
