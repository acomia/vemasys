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
  const customDocuments = await API.get(`v3/Charter/${charterId}/files`)
  if (customDocuments && customDocuments.data.length) {
    return ReactNativeBlobUtil.config({
      fileCache: true,
    }).fetch(
      'GET',
      `https://app-uat.vemasys.eu/upload/documents/${
        customDocuments.data[customDocuments.data.length - 1].path
      }`,
      {
        'Jwt-Auth': `Bearer ${token}`,
        'X-active-entity-user-id': `${entityUserId}`,
      }
    )
  }
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
    .then(
      response => response.data
      // ? UPLOAD_CHARTER_SIGNATURE_SUCCESS
      // : UPLOAD_CHARTER_SIGNATURE_FAILED
    )
    .catch(error => {
      console.log('Error: Upload Signature failed', error)
      return UPLOAD_CHARTER_SIGNATURE_FAILED
    })

const getSignature = async (signatureId: string) => {
  return API.get(`signature/${signatureId}`)
    .then(response => {
      if (response.data) {
        return response.data
      } else {
        throw new Error('Charter upload signature failed.')
      }
    })
    .catch(error => {
      console.error('Error: Charter upload signature API', error)
    })
}

const updateCharter = (charterId: string, data: any) => {
  API.put(`v2/charters/${charterId}`, data)
    .then(response => {
      if (response.status === 200) {
        return response.status
      }

      throw new Error('Update charter failed')
    })
    .catch(error => {
      console.error('Error: Update charter API ', error)
    })
}

const linkSignPDFToCharter = async (
  path: string,
  description: string,
  charterID: number
) => {
  const payload = {
    path,
    description,
    type: {
      title: 'charter_download',
      relevance: null,
    },
  }
  const customDocuments = await API.get(`v3/Charter/${charterID}/files`)
  if (customDocuments.data.length) {
    await API.delete(
      `v2/files/${customDocuments.data[customDocuments.data.length - 1].id}`
    )
  }
  return API.post(`v3/Charter/${charterID}/files`, payload)
    .then(response => {
      if (response.data) {
        return response.data
      } else {
        throw new Error('Linking signed PDF to charter failed.')
      }
    })
    .catch(error => {
      console.error('Error: linking signed PDF to charter', error)
    })
}

export {
  reloadVesselCharters,
  viewPdfFile,
  updateCharterStatus,
  uploadSignature,
  getSignature,
  updateCharter,
  linkSignPDFToCharter,
}
