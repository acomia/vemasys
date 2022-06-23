import {ResponseTransform} from 'apisauce'
import camelcaseKeys from 'camelcase-keys'

export const dataToCamelCase: ResponseTransform = response => {
  if (response.data) {
    response.data = camelcaseKeys(response.data, {deep: true})
  }
}
