import React, {useRef} from 'react'
import {AlertDialog, Button, Text} from 'native-base'
import {useEntity, useSettings} from '@bluecentury/stores'
import {useNavigation} from '@react-navigation/native'
import {useTranslation} from 'react-i18next'

export default function TrackingServiceDialog() {
  const {t} = useTranslation()
  const navigation = useNavigation()
  const {selectedVessel} = useEntity()
  const {isMobileTracking, setIsMobileTracking} = useSettings()
  const onClose = () => navigation.goBack()
  const handleOnToggleTrackingService = () => {
    setIsMobileTracking(!isMobileTracking)
    navigation.goBack()
  }
  const cancelRef = useRef<any>()
  const status = isMobileTracking ? t('disable') : t('enable')
  return (
    <AlertDialog
      leastDestructiveRef={cancelRef}
      isOpen={true}
      onClose={onClose}
    >
      <AlertDialog.Content>
        <AlertDialog.CloseButton />
        <AlertDialog.Header>{t('tracking')}</AlertDialog.Header>
        <AlertDialog.Body>
          <Text>
            This will {status} tracking service in this device and will{' '}
            {isMobileTracking ? 'stop' : 'start'} sending GPS coordinates for{' '}
            {selectedVessel?.alias}.
          </Text>
        </AlertDialog.Body>
        <AlertDialog.Footer>
          <Button.Group space={2}>
            <Button
              variant="unstyled"
              colorScheme="coolGray"
              onPress={onClose}
              ref={cancelRef}
            >
              {t('cancel')}
            </Button>
            <Button
              colorScheme={isMobileTracking ? 'danger' : 'info'}
              onPress={handleOnToggleTrackingService}
            >
              {isMobileTracking ? t('turnOff') : t('turnOn')}}
            </Button>
          </Button.Group>
        </AlertDialog.Footer>
      </AlertDialog.Content>
    </AlertDialog>
  )
}
