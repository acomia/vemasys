import orderBy from 'lodash/orderBy'
import {API} from '@bluecentury/api/apiService'
import ReactNativeBlobUtil from 'react-native-blob-util'
import {API_URL} from '@vemasys/env'
import {useAuth, useEntity} from '@bluecentury/stores'

const reloadVesselCharters = async () => {
  const isArchived = 0
  return API.get(`v3/charters?isArchived=${isArchived}`)
    .then(response => {
      if (response.data.length > 0) {
        return orderBy(response.data, 'charterDate', 'desc')
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
