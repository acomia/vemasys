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
      if (response.data) {
        return response?.data?.id ? 'SUCCESS' : 'FAILED'
      } else {
        throw Error('Request Failed')
      }
    })
    .catch(error => {
      console.error('Error: API Role for accept', error)
    })
}

const rejectPendingRole = async (id: string) => {
  return API.put(`entity_users/${id}/reject_by_user`, {})
    .then(response => {
      if (response.data) {
        return response?.data?.id ? 'REJECTED' : 'FAILED'
      } else {
        throw Error('Request Failed')
      }
    })
    .catch(error => {
      console.error('Error: API Role for accept', error)
    })
}

const createSignUpRequest = async (userInfo: any, docs: Array<any>) => {
  const signUpRequest = Object.assign(
    {},
    userInfo,
    {
      mmsi: parseInt(userInfo.mmsi),
    },
    ...docs.map(file => file)
  )

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

export {
  reloadEntityUsers,
  getVesselNavigationDetails,
  selectEntityUser,
  getRoleForAccept,
  acceptPendingRole,
  rejectPendingRole,
  createSignUpRequest,
}
