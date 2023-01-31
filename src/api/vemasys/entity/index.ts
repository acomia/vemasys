import {R} from 'react-native-shadow-2'
import {API} from '../../apiService'

const reloadEntityUsers = async () => {
  return API.get<any>('v2/active_entity_users')
    .then(response => {
      if (response.data) {
        return response.data
      } else {
        throw Error('Request Failed')
      }
    })
    .catch(error => {
      console.error('Error: API Entity Users ', error)
    })
}

const getVesselNavigationDetails = async (vesselId: string) => {
  return API.get<any>(`exploitation_vessels/${vesselId}`)
    .then(response => {
      if (response.data) {
        return response.data
      } else {
        throw Error('Request Failed')
      }
    })
    .catch(error => {
      console.error('Error: Vessel details ', error)
    })
}

const selectEntityUser = (entityId: string) => {
  return API.interceptors.request.use(req => {
    req.headers = {
      ...req.headers,
      'X-active-entity-user-id': `${entityId}`,
    }
    return req
  })
}

const getRoleForAccept = async (userId: string) => {
  return API.get(
    `entity_users?user.id=${userId}&isEndDateExpired=0&exists[deletedAt]=0&hasEntityAccepted=1&hasUserAccepted=0`
  )
    .then(response => {
      if (response.data) {
        return response.data
      } else {
        throw Error('Request Failed')
      }
    })
    .catch(error => {
      console.error('Error: API Role for accept', error)
    })
}

const acceptPendingRole = async (id: string) => {
  return API.put(`entity_users/${id}/accept_by_user`, {})
    .then(response => {
      return Promise.resolve(response.data.id ? 'SUCCESS' : 'FAILED')
    })
    .catch(error => {
      console.error('Error: API Role for accept', error)
      return Promise.reject('')
    })
}

const rejectPendingRole = async (id: string) => {
  return API.put(`entity_users/${id}/reject_by_user`, {})
    .then(response => {
      return Promise.resolve(response.data.id ? 'REJECTED' : 'FAILED')
    })
    .catch(error => {
      console.error('Error: API Role for accept', error)
      return Promise.reject('')
    })
}

export {
  reloadEntityUsers,
  getVesselNavigationDetails,
  selectEntityUser,
  getRoleForAccept,
  acceptPendingRole,
  rejectPendingRole,
}
