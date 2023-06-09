import {API} from '../../apiService'
import {VESSEL_PART_CARGO_TYPE} from '@bluecentury/constants'
import axios from 'axios'
import {useAuth, useEntity, useSettings} from '@bluecentury/stores'
import {Platform} from 'react-native'

const reloadNavigationLogDetails = async (navLogId: string) => {
  return API.get(`navigation_logs/${navLogId}`)
    .then(response => {
      if (response.data) {
        return response.data
      } else {
        throw new Error('Navigation log details failed.')
      }
    })
    .catch(error => {
      console.error('Error: Navigation log details fetching data', error)
    })
}

const reloadNavigationLogActions = async (navLogId: string) => {
  return API.get(`navigation_log_actions?navigationLog.id=${navLogId}`)
    .then(response => {
      if (response.data) {
        return response.data
      } else {
        throw new Error('Navigation log actions failed.')
      }
    })
    .catch(error => {
      console.error('Error: Navigation log actions fetching data', error)
    })
}
const reloadNavigationLogCargoHolds = async (physicalVesselId: string) => {
  return API.get(
    `vessel_parts?part.type.title=${VESSEL_PART_CARGO_TYPE}&vesselZone.physicalVessel.id=${physicalVesselId}`
  )
    .then(response => {
      if (response.data) {
        return response.data
      } else {
        throw new Error('Navigation log cargo failed.')
      }
    })
    .catch(error => {
      console.error('Error: Navigation log cargo fetching data', error)
    })
}
const reloadNavigationLogComments = async (navLogId: string) => {
  // return API.get(`navigation_log_comments?log.id=${navLogId}`)
  const subjectName = 'NavigationLog'
  return API.get(`v3/${subjectName}/${navLogId}/comments`)
    .then(response => {
      if (response.data) {
        return response.data
      } else {
        throw new Error('Navigation log comments failed.')
      }
    })
    .catch(error => {
      console.error('Error: Navigation log comments fetching data', error)
    })
}
const reloadNavigationLogDocuments = async (navLogId: string) => {
  return API.get(`navigation_logs/${navLogId}/documents`)
    .then(response => {
      if (response.data) {
        return response.data
      } else {
        throw new Error('Navigation log documents failed.')
      }
    })
    .catch(error => {
      console.error('Error: Navigation log documents fetching data', error)
    })
}
const reloadNavigationLogRoutes = async (navLogId: string) => {
  return API.get(`v3/navigation_logs/${navLogId}/routes`)
    .then(response => {
      if (response.data) {
        console.clear()
        return response.data
      }

      throw new Error('Navigation log routes failed.')
    })
    .catch(error => {
      console.error('Error: Navigation log routes fetching data', error)
    })
}
const updateNavigationLogDatetimeFields = async (
  navLogId: string,
  dates: object
) => {
  const token = useAuth.getState().token
  const entityUserId = useEntity.getState().entityUserId
  const API_URL = useSettings.getState().apiUrl
  const config = {
    headers: {
      'Content-Type': 'application/json',
      'Jwt-Auth': `Bearer ${token}`,
      'X-active-entity-user-id': `${entityUserId}`,
    },
  }

  try {
    const res = await axios.put(
      `${API_URL}navigation_logs/${navLogId}`,
      dates,
      config
    )
    if (!res?.data) {
      throw new Error('Update navlog datetime failed.')
    }
    return res?.data
  } catch (error: any) {
    return error?.response?.data
      ? error?.response?.data?.violations[0]?.message
      : 'Update failed.'
  }
}

const createNavlogComment = async (
  navlogId: string,
  comment: string,
  accessLvl: string
) => {
  const subjectName = 'NavigationLog'
  return API.post(`v3/${subjectName}/${navlogId}/comments`, {
    description: comment,
    accessLevel: accessLvl,
  })
    .then(response => {
      if (response.data) {
        return response.data
      } else {
        throw new Error('Create navlog comment failed.')
      }
    })
    .catch(error => {
      console.error('Error: Create navlog comment data', error)
    })
}

const reloadBulkTypes = async (query: string) => {
  return API.get(
    `bulk_types?nameNL=${query}&nameEN=${query}&nameFR=${query}&nameDE=${query}`
  )
    .then(response => {
      if (response.data) {
        return response.data
      } else {
        throw new Error('Fetch bulk types failed.')
      }
    })
    .catch(error => {
      console.error('Error: Fetch bulk types data', error)
    })
}

const updateBulkCargoEntry = async (cargo: any) => {
  return API.put(`navigation_bulks/${cargo.id}`, {
    type: {id: parseInt(cargo.typeId)},
    amount: cargo.amount.toString(),
    actualAmount: cargo.actualAmount.toString(),
    isLoading: cargo.isLoading === '1',
  })
    .then(response => {
      if (response.data) {
        return response.data
      } else {
        throw new Error('Update bulk cargo failed.')
      }
    })
    .catch(error => {
      console.error('Error: Update bulk cargo data', error)
    })
}

const createNewBulkCargoEntry = async (cargo: any, navLogId: string) => {
  return API.post(
    'navigation_bulks',
    {
      log: {
        id: navLogId,
      },
      type: {id: parseInt(cargo.typeId)},
      amount: cargo.amount,
      actualAmount: cargo.actualAmount,
      isLoading: cargo.isLoading === '1',
    },
    {}
  )
    .then(response => {
      if (response.data) {
        return response.data
      } else {
        throw new Error('Create new bulk cargo entry failed.')
      }
    })
    .catch(error => {
      console.error('Error: Create new bulk cargo entry data', error)
    })
}

const deleteBulkCargoEntry = async (id: string) => {
  return API.delete(`navigation_bulks/${id}`)
    .then(response => {
      if (response.status) {
        return response.status
      } else {
        throw new Error('Delete bulk cargo entry failed.')
      }
    })
    .catch(error => {
      console.error('Error: Delete bulk cargo entry data', error)
    })
}

const updateComment = async (
  id: string,
  description: string,
  accessLevel: string
) => {
  return API.put(`v3/comments/${id}`, {description, accessLevel})
    .then(response => {
      if (response.data) {
        return response.data
      } else {
        throw new Error('Update comment failed.')
      }
    })
    .catch(error => {
      console.error('Error: Update comment data', error)
    })
}

const uploadImgFile = async (file: ImageFile) => {
  const formData = new FormData()
  const image = {
    uri: Platform.OS === 'android' ? `file://${file.uri}` : file.uri,
    type: file.type,
    name: file.fileName || `IMG_${Date.now()}`,
  }

  formData.append('file', image)

  const token = useAuth.getState().token
  const entityUserId = useEntity.getState().entityUserId
  const API_URL = useSettings.getState().apiUrl

  try {
    const res = await axios.post(`${API_URL}v2/files`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        'Jwt-Auth': `Bearer ${token}`,
        'X-active-entity-user-id': `${entityUserId}`,
      },
    })
    return res.data
  } catch (error: any) {
    console.error(
      'Error: Upload image file data',
      JSON.stringify(error.response)
    )
  }
}

const deleteComment = async (id: string) => {
  return API.delete(`v3/comments/${id}`)
    .then(response => {
      if (response.status) {
        return response.status
      } else {
        throw new Error('Delete comment failed.')
      }
    })
    .catch(error => {
      console.error('Error: Delete comment data', error)
    })
}

const uploadVesselNavigationLogFile = async (navLogId: string, body: any) => {
  return API.put(`navigation_logs/${navLogId}`, body)
    .then(response => {
      if (response.data) {
        return response.data
      } else {
        throw new Error('Update navlog datetime failed.')
      }
    })
    .catch(error => {
      console.error('Error: Update navlog datetime data', error)
    })
}

const createNavigationLogAction = async (body: any) => {
  return API.post('navigation_log_actions', body)
    .then(response => {
      if (response.data) {
        return response.data
      } else {
        throw new Error('Create navlog action.')
      }
    })
    .catch(error => {
      console.error('Error:Create navlog action data', error)
    })
}
const updateNavigationLogAction = async (id: string, body: any) => {
  return API.put(`navigation_log_actions/${id}`, body)
    .then(response => {
      if (response.data) {
        return response.data
      } else {
        throw new Error('Update navlog action.')
      }
    })
    .catch(error => {
      console.error('Error:Update navlog action data', error)
    })
}

const deleteNavigationLogAction = async (id: string) => {
  return API.delete(`navigation_log_actions/${id}`)
    .then(response => {
      if (response.status) {
        return response.status
      } else {
        throw new Error('Delete navlog action.')
      }
    })
    .catch(error => {
      console.error('Error:Delete navlog action data', error)
    })
}
export {
  reloadNavigationLogDetails,
  reloadNavigationLogActions,
  reloadNavigationLogCargoHolds,
  reloadNavigationLogComments,
  reloadNavigationLogDocuments,
  reloadNavigationLogRoutes,
  updateNavigationLogDatetimeFields,
  createNavlogComment,
  reloadBulkTypes,
  updateBulkCargoEntry,
  createNewBulkCargoEntry,
  deleteBulkCargoEntry,
  updateComment,
  uploadImgFile,
  deleteComment,
  uploadVesselNavigationLogFile,
  createNavigationLogAction,
  updateNavigationLogAction,
  deleteNavigationLogAction,
}
