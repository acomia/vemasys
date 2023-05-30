import React from 'react'
import {AlertDialog, Button, IButtonProps, HStack, Box} from 'native-base'
import {IAlertDialogProps} from 'native-base/lib/typescript/components/composites'
import {ms} from 'react-native-size-matters'
import {Colors} from '@bluecentury/styles'

type AlertDialogProps = IAlertDialogProps

interface Props {
  title?: string | Element
  content: string | Element
  alert: AlertDialogProps
  buttons: IButtonProps[]
}

export default ({alert, buttons, title, content}: Props) => {
  return (
    <Box>
      <AlertDialog {...alert}>
        <AlertDialog.Content width={'100%'}>
          <AlertDialog.CloseButton />
          <AlertDialog.Header>{title}</AlertDialog.Header>
          <AlertDialog.Body>{content}</AlertDialog.Body>
          <AlertDialog.Footer>
            {/* <Button.Group space={2}> */}
            <HStack space={ms(5)}>
              {buttons.map((props, index) => (
                <Box key={`button-${index}`} width={'50%'}>
                  <Button width={'100%'} {...props} />
                </Box>
              ))}
            </HStack>
            {/* </Button.Group> */}
          </AlertDialog.Footer>
        </AlertDialog.Content>
      </AlertDialog>
    </Box>
  )
}
