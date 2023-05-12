import {error} from 'pdf-lib'
import React, {useState} from 'react'

export const useForm = (initialValues: object, validationRules: {}) => {
  const [formValues, setFormValues] = useState<any>(initialValues)
  const [errors, setErrors] = useState<any>({})
  const [isUpdated, setUpdated] = useState<any>({})

  const handleOnChange = (name: string, value: string) => {
    setFormValues({
      ...formValues,
      [name]: value,
    })
    setUpdated({
      ...isUpdated,
      [name]: true,
    })
  }

  const handleSubmit = (onSubmit: Function) => {
    const validationErrors: any = {}

    if (validationRules && Object.keys(validationRules).length > 0) {
      Object.keys(validationRules).forEach(fieldName => {
        const fieldValue = formValues[fieldName]
        const validationRule = validationRules[fieldName]

        if (validationRule.required && !fieldValue) {
          validationErrors[fieldName] = `${fieldName} is required`
        }

        if (
          validationRule.minLength &&
          fieldValue.length < validationRule.minLength
        ) {
          validationErrors[
            fieldName
          ] = `${fieldName} should have a minimum length of ${validationRule.minLength}`
        }
      })
    }

    setErrors(validationErrors)

    if (Object.keys(validationErrors).length === 0) {
      onSubmit()
    }
  }

  const hasError = (fieldName: string) => {
    return errors[fieldName]
  }

  const setError = (fieldName: string, error: string) => {
    setErrors({...errors, [fieldName]: error})
  }

  return {
    formValues,
    setFormValues,
    handleOnChange,
    errors,
    setErrors,
    handleSubmit,
    hasError,
    setError,
  }
}
