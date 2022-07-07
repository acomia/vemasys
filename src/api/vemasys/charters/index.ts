import _ from 'lodash'
import {API} from '@bluecentury/api/apiService'
import ReactNativeBlobUtil from 'react-native-blob-util'
import {PROD_URL} from '@bluecentury/env'
import {useAuth} from '@bluecentury/stores'

const reloadVesselCharters = async () => {
  return API.get(`v3/charters?isArchived=0`)
    .then(response => {
      if (response.data.length > 0) {
        return _.orderBy(response.data, 'charterDate', 'desc')
      } else {
        return []
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

const viewPdfFile = async (charterId: string) => {
  return await ReactNativeBlobUtil.config({
    fileCache: true
  })
    .fetch('GET', `${PROD_URL}/api/charters/${charterId}/pdf`, {
      'Jwt-Auth': `Bearer ${useAuth.getState().token}`
    })
    .then(response => {
      console.log('path', response)

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
