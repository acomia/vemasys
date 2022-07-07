import React, {useEffect} from 'react'
import {Box, Button, Icon, ScrollView, Text} from 'native-base'
import {ms} from 'react-native-size-matters'
import Ionicons from 'react-native-vector-icons/Ionicons'
import {useRoute} from '@react-navigation/native'

import {Colors} from '@bluecentury/styles'
import {usePlanning} from '@bluecentury/stores'
import {LoadingIndicator} from '@bluecentury/components'

const Documents = () => {
  const route = useRoute()
  const {isPlanningLoading, navigationLogDocuments, getNavigationLogDocuments} =
    usePlanning()
  const {navlog}: any = route.params

  useEffect(() => {
    getNavigationLogDocuments(navlog.id)
  }, [])
  console.log(navigationLogDocuments)

  if (isPlanningLoading) return <LoadingIndicator />
  return (
    <Box flex="1">
      <ScrollView contentContainerStyle={{flexGrow: 1}} px={ms(12)} py={ms(20)}>
        <Text fontSize={ms(20)} fontWeight="bold" color={Colors.azure}>
          Additional Documents
        </Text>
      </ScrollView>
      <Button
        bg={Colors.primary}
        leftIcon={<Icon as={Ionicons} name="add" size="sm" />}
        mt={ms(20)}
        mb={ms(20)}
        mx={ms(12)}
      >
        Add file
      </Button>
    </Box>
  )
}

export default Documents
