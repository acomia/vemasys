import React from 'react'
import {AlertDialog, Button, IButtonProps} from 'native-base'
import {IAlertDialogProps} from 'native-base/lib/typescript/components/composites'

interface AlertDialogProps extends IAlertDialogProps {}

interface Props {
  title?: string
  content: string
  alert: AlertDialogProps
  buttons: IButtonProps[]
}

export function CustomAlert({alert, buttons, title, content}: Props) {
  return (
    <>
      <AlertDialog {...alert}>
        <AlertDialog.Content>
          <AlertDialog.CloseButton />
          <AlertDialog.Header>{title}</AlertDialog.Header>
          <AlertDialog.Body>{content}</AlertDialog.Body>
          <AlertDialog.Footer>
            <Button.Group space={2}>
              {buttons.map((props, index) => (
                <Button key={`button-${index}`} {...props} />
              ))}
            </Button.Group>
          </AlertDialog.Footer>
        </AlertDialog.Content>
      </AlertDialog>
    </>
  )
}
