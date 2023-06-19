import {R} from 'react-native-shadow-2'
import {API} from '../../apiService'
import {usePlanning} from '@bluecentury/stores'

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

const acceptPendingUser = async (id: number) => {
  return API.put(`entity_users/${id}/accept_by_entity`, {})
    .then(response => {
      return Promise.resolve(response.data.id ? 'SUCCESS' : 'FAILED')
    })
    .catch(error => {
      console.error('Error: API Role for accept', error)
      return Promise.reject('')
    })
}

const rejectPendingUser = async (id: number) => {
  return API.put(`entity_users/${id}/reject_by_entity`, {})
    .then(response => {
      return Promise.resolve(response.data.id ? 'REJECTED' : 'FAILED')
    })
    .catch(error => {
      console.error('Error: API Role for accept', error)
      return Promise.reject('')
    })
}

const createSignUpRequest = async (userInfo: any, docs: Array<any>) => {
  let signUpRequest
  signUpRequest = Object.assign({}, userInfo, {
    mmsi: userInfo.mmsi ? parseInt(userInfo.mmsi) : null,
  })
  if (docs.length > 0) {
    signUpRequest = Object.assign(
      {},
      userInfo,
      {
        mmsi: userInfo.mmsi ? parseInt(userInfo.mmsi) : null,
      },
      ...docs.map(file => file)
    )
  }

  return API.post('signup_requests', signUpRequest)
    .then(response => {
      return Promise.resolve(
        typeof response.data === 'object' && response.status === 201
          ? 'SUCCESS'
          : 'FAILED'
      )
    })
    .catch(error => {
      console.error('Error: API Signup requests', error)
      return Promise.reject('')
    })
}

const getEntityInfo = async (id: string) => {
  return API.get(`entities/${id}`)
    .then(response => {
      if (response.data) {
        return response.data
      } else {
        throw Error('Request Failed')
      }
    })
    .catch(error => {
      console.error('Error: API Entity Info ', error)
    })
}

const getUsersWaitingForApprove = async (entityId: number | string) => {
  return API.get(`entity_users?entity.id=${entityId}&hasEntityAccepted=0`)
    .then(response => {
      if (response.data) {
        return response.data
      } else {
        throw Error('Users waiting for approve Request Failed')
      }
    })
    .catch(error => {
      console.error(
        'Error: API Users waiting for approve ',
        JSON.stringify(error)
      )
    })
}

export {
  reloadEntityUsers,
  getVesselNavigationDetails,
  selectEntityUser,
  getRoleForAccept,
  acceptPendingRole,
  rejectPendingRole,
  acceptPendingUser,
  rejectPendingUser,
  createSignUpRequest,
  getEntityInfo,
  getUsersWaitingForApprove,
}
