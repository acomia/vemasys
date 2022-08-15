import _ from 'lodash'
import {API} from '@bluecentury/api/apiService'
import ReactNativeBlobUtil from 'react-native-blob-util'
import {PROD_URL, API_URL} from '@bluecentury/env'
import {useAuth, useEntity} from '@bluecentury/stores'

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

const viewPdfFile = async (charterId: string) => {
  const token = useAuth.getState().token
  const entityUserId = useEntity.getState().entityUserId
  return await ReactNativeBlobUtil.config({
    fileCache: true
  }).fetch('GET', `${API_URL}charters/${charterId}/pdf`, {
    'Jwt-Auth': `Bearer ${token}`,
    'X-active-entity-user-id': `${entityUserId}`
  })
}

export {reloadVesselCharters, viewPdfFile}
