import orderBy from 'lodash/orderBy'
import {API} from '@bluecentury/api/apiService'
import ReactNativeBlobUtil from 'react-native-blob-util'
import {useAuth, useEntity, useSettings} from '@bluecentury/stores'

type UpdateStatus = {
  status?: string
  setContractorStatus?: boolean
}

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
  const API_URL = useSettings.getState().apiUrl
  return await ReactNativeBlobUtil.config({
    fileCache: true
  }).fetch('GET', `${API_URL}charters/${charterId}/pdf`, {
    'Jwt-Auth': `Bearer ${token}`,
    'X-active-entity-user-id': `${entityUserId}`
  })
}

const updateCharterStatus = async (charterId: string, status: UpdateStatus) => {
  return API.post(`v2/charters/${charterId}/update_status`, status)
    .then(response => {
      if (response.data) {
        return response.data
      } else {
        throw new Error('Charter update status failed.')
      }
    })
    .catch(error => {
      console.error('Error: Charter update status API', error)
    })
}

export {reloadVesselCharters, viewPdfFile, updateCharterStatus}
