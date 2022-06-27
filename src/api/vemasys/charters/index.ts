import _ from 'lodash'
import {API} from '@bluecentury/api/apiService'
import ReactNativeBlobUtil from 'react-native-blob-util'
import {PROD_URL} from '@bluecentury/env'
import {useAuth} from '@bluecentury/stores'

const reloadVesselCharters = async () => {
  return API.get(`v3/charters?isArchived=0`)
    .then(response => {
      if (response.data) {
        return _.orderBy(response.data, 'charterDate', 'desc')
      } else {
        throw new Error('Charters failed.')
      }
    })
    .catch(error => {
      console.error('Error: Charters API', error)
    })
}

// const downloadPdf =async (path:string) => {
//   const options = {
//     fileCache: true,
//   }
//   const {config} = ReactNativeBlobUtil
//   return await config(options).fetch('GET', `${store.getState().api.restBaseUrl}${path}`, {
//     'Jwt-Auth': `Bearer ${store.getState().auth.jwt}`,
//   })
// }

const viewPdfFile = async (charterId: string, token: string) => {
  return await ReactNativeBlobUtil.config({
    fileCache: true
  })
    .fetch('GET', `${PROD_URL}/api/charters/${charterId}/pdf`, {
      'Jwt-Auth': `Bearer ${token}`
    })
    .then(response => {
      console.log('pdf', response)

      if (response.data) {
        return response.path()
      } else {
        throw new Error('Charters pdf file failed.')
      }
    })
    .catch(error => {
      console.error('Error: Charters PDF File', error)
    })
}

export {reloadVesselCharters, viewPdfFile}
