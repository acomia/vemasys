import React, {useState, useEffect, useRef} from 'react'
import {Button, FormControl, HStack, Input, Modal, VStack} from 'native-base'
import {useTranslation} from 'react-i18next'
import {ms} from 'react-native-size-matters'
import {useCharters} from '@bluecentury/stores'

interface IAppProps {
  isOpen: boolean
  setOpen: () => void
  charter: any | null
}

export default function App({isOpen, setOpen, charter}: IAppProps) {
  const {t} = useTranslation()
  const {updateCharter} = useCharters()

  const [reference, setReference] = useState('')
  const [errors, setErrors] = useState({})
  const inputRef = useRef<any>(null)

  const handleChangeReference = () => {
    if (!reference) {
      setErrors({...errors, reference: 'required'})
      return
    }

    updateCharter(charter.id, {clientReference: reference})
  }

  return (
    <Modal flex={1} isOpen={isOpen} width="full" onClose={setOpen}>
      <Modal.Content width="full">
        <Modal.Header>{t('editReference')}</Modal.Header>
        <Modal.Body>
          <VStack space={ms(20)}>
            <FormControl isRequired isInvalid={'reference' in errors}>
              <Input
                ref={inputRef}
                value={reference}
                onChangeText={value => setReference(value)}
              />
              {''}
            </FormControl>
            <HStack flex={1} justifyContent="space-evenly">
              <Button width="48%" onPress={setOpen}>
                {t('cancel')}
              </Button>
              <Button width="48%" onPress={() => handleChangeReference()}>
                {t('save')}
              </Button>
            </HStack>
          </VStack>
        </Modal.Body>
      </Modal.Content>
    </Modal>
  )
}
