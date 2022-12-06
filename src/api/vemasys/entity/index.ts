import {API} from '../../apiService'

const reloadUser = async () => {
  return API.get<any>('me')
    .then(response => {
      if (response.data) {
        return response.data
      } else {
        throw Error('Request Failed')
      }
    })
    .catch(error => {
      console.error('Error: API User ', error)
    })
}

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

const updatePendingRole = async (id: string, state: boolean) => {
  return API.put(`entity_users/${id}`, {hasUserAccepted: state})
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

export {
  reloadUser,
  reloadEntityUsers,
  getVesselNavigationDetails,
  selectEntityUser,
  getRoleForAccept,
  updatePendingRole,
}
