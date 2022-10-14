import orderBy from 'lodash/orderBy'
import {API} from '@bluecentury/api/apiService'
import ReactNativeBlobUtil from 'react-native-blob-util'
import {useAuth, useEntity, useSettings} from '@bluecentury/stores'
import {
  UPDATE_CHARTER_FAILED,
  UPDATE_CHARTER_SUCCESS,
  UPLOAD_CHARTER_SIGNATURE_FAILED,
  UPLOAD_CHARTER_SIGNATURE_SUCCESS,
} from '@bluecentury/constants'

type UpdateStatus = {
  status?: string
  setContractorStatus?: boolean
}

type Signature = {
  user: string
  signature: string
  signedDate: Date
  charter: string
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
    fileCache: true,
  }).fetch('GET', `${API_URL}charters/${charterId}/pdf`, {
    'Jwt-Auth': `Bearer ${token}`,
    'X-active-entity-user-id': `${entityUserId}`,
  })
}

// TODO: There are currently two versions of the API
// v2 returns a string and is a POST method
// v3 returns an object and is a PUT method
// in a sense, for updating, we should use PUT instead of POST
// propose to update to v3 here instead
const updateCharterStatus = async (charterId: string, status: UpdateStatus) =>
  API.post<string>(`v2/charters/${charterId}/update_status`, status)
    .then(response =>
      response.data ? UPDATE_CHARTER_SUCCESS : UPDATE_CHARTER_FAILED
    )
    .catch(error => {
      console.error('Error: Charter update status API', error)
      return UPDATE_CHARTER_FAILED
    })

const uploadSignature = async (signature: Signature) =>
  API.post('signatures', signature)
    .then(response =>
      response.data
        ? UPLOAD_CHARTER_SIGNATURE_SUCCESS
        : UPLOAD_CHARTER_SIGNATURE_FAILED
    )
    .catch(error => {
      console.log('Error: Upload Signature failed', error)
      return UPLOAD_CHARTER_SIGNATURE_FAILED
    })

export {reloadVesselCharters, viewPdfFile, updateCharterStatus, uploadSignature}
