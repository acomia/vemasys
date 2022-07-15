import React, {useEffect} from 'react'
import {
  Actionsheet,
  Box,
  Button,
  Icon,
  ScrollView,
  Text,
  useDisclose
} from 'native-base'
import {ms} from 'react-native-size-matters'
import Ionicons from 'react-native-vector-icons/Ionicons'
import {useRoute} from '@react-navigation/native'

import {Colors} from '@bluecentury/styles'
import {usePlanning} from '@bluecentury/stores'
import {LoadingIndicator} from '@bluecentury/components'
import DocumentPicker, {
  DirectoryPickerResponse,
  DocumentPickerResponse,
  isInProgress,
  types
} from 'react-native-document-picker'

const Documents = () => {
  const route = useRoute()
  const {navlog}: any = route.params
  const {isPlanningLoading, navigationLogDocuments, getNavigationLogDocuments} =
    usePlanning()
  const {isOpen, onOpen, onClose} = useDisclose()
  const [result, setResult] = React.useState<
    Array<DocumentPickerResponse> | DirectoryPickerResponse | undefined | null
  >()

  useEffect(() => {
    getNavigationLogDocuments(navlog.id)
  }, [])

  const handleError = (err: unknown) => {
    if (DocumentPicker.isCancel(err)) {
      console.warn('cancelled')
      // User cancelled the picker, exit any dialogs or menus and move on
    } else if (isInProgress(err)) {
      console.warn(
        'multiple pickers were opened, only the last will be considered'
      )
    } else {
      throw err
    }
  }

  const onScanDocument = () => {
    onClose()
  }

  const onSelectDocument = async () => {
    try {
      const pickerResult = await DocumentPicker.pickSingle({
        presentationStyle: 'fullScreen',
        copyTo: 'cachesDirectory'
      })
      console.log(pickerResult)
      onClose()
      setResult([pickerResult])
    } catch (e) {
      handleError(e)
    }
  }

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
        onPress={onOpen}
      >
        Add file
      </Button>
      <Actionsheet isOpen={isOpen} onClose={onClose}>
        <Actionsheet.Content>
          <Actionsheet.Item onPress={onScanDocument}>
            Scan document
          </Actionsheet.Item>
          <Actionsheet.Item onPress={onSelectDocument}>
            Select document from files
          </Actionsheet.Item>
          <Actionsheet.Item onPress={onClose}>Cancel</Actionsheet.Item>
        </Actionsheet.Content>
      </Actionsheet>
    </Box>
  )
}

export default Documents
