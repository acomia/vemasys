import {useAuth} from '@bluecentury/stores'
import {ResponseTransform} from 'apisauce'
import camelcaseKeys from 'camelcase-keys'
import {API} from '../apiService'

export const dataToCamelCase: ResponseTransform = async response => {
  if (response.originalError?.config) {
    try {
      API.deleteHeader('Jwt-Auth')
      const res = await useAuth.getState().resetToken()
      if (res) {
        return Promise.resolve(response.originalError.config)
      } else {
        useAuth.getState().logout()
      }
    } catch (error) {
      useAuth.getState().logout()
    }
  } else {
    if (response.data) {
      response.data = camelcaseKeys(response.data, {deep: true})
    }
  }
}
