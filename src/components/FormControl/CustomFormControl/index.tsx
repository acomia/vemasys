import React from 'react'
import {FormControl, WarningOutlineIcon} from 'native-base'

interface Props {
  label: string
  children: Element
  errorMessage?: string
  isRequired?: boolean
  isInvalid?: boolean
  isDisabled: boolean
}

export default ({
  label,
  children,
  errorMessage,
  isRequired = false,
  isInvalid = false,
  isDisabled = false,
}: Props) => {
  console.log('isRequied', isRequired)
  console.log('isInvalid', isInvalid)

  return (
    <FormControl
      isDisabled={isDisabled}
      isInvalid={isInvalid}
      isRequired={isRequired}
    >
      <FormControl.Label>{label}</FormControl.Label>
      {children}
      <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>
        {errorMessage}
      </FormControl.ErrorMessage>
    </FormControl>
  )
}
