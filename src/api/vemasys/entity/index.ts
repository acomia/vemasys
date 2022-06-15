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

const reloadUserVessels = async (userId: string) => {
  const entityTypeId = 3
  return API.get<any>(
    `entity_users?user.id=${userId}&entity.type.id=${entityTypeId}&endDate[exists]=0`
  )
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

const selectEntityUser = (entityId: string) => {
  return API.setHeader('X-active-entity-user-id', `${entityId}`)
}

export {reloadUser, reloadEntityUsers, reloadUserVessels, selectEntityUser}
