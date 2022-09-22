import React, {useEffect, useRef} from 'react'
import {AlertDialog, Box, Button, Text} from 'native-base'
import {useSettings} from '@bluecentury/stores'
import {Colors} from '@bluecentury/styles'
import {useNavigation} from '@react-navigation/native'

export default function TrackingServiceDialog() {
  const navigation = useNavigation()
  const {isMobileTracking, setIsMobileTracking} = useSettings()
  const onClose = () => navigation.goBack()
  const handleOnToggleTrackingService = () => {
    setIsMobileTracking(!isMobileTracking)
    navigation.goBack()
  }
  const cancelRef = useRef<any>()
  const status = isMobileTracking ? 'disable' : 'enable'
  return (
    <AlertDialog
      leastDestructiveRef={cancelRef}
      isOpen={true}
      onClose={onClose}
    >
      <AlertDialog.Content>
        <AlertDialog.CloseButton />
        <AlertDialog.Header>Tracking Service</AlertDialog.Header>
        <AlertDialog.Body>
          <Text>This will {status} tracking service of this device.</Text>
        </AlertDialog.Body>
        <AlertDialog.Footer>
          <Button.Group space={2}>
            <Button
              variant="unstyled"
              colorScheme="coolGray"
              onPress={onClose}
              ref={cancelRef}
            >
              Cancel
            </Button>
            <Button
              colorScheme={isMobileTracking ? 'danger' : 'info'}
              onPress={handleOnToggleTrackingService}
            >
              {isMobileTracking ? 'Turn off' : 'Turn on'}
            </Button>
          </Button.Group>
        </AlertDialog.Footer>
      </AlertDialog.Content>
    </AlertDialog>
  )
}
