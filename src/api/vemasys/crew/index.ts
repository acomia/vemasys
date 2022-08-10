import moment from 'moment'
import {API} from '../../apiService'

const reloadCrew = async (vesselId: string) => {
  return API.get(`exploitation-vessel/${vesselId}/crew`)
    .then(response => {
      if (response.data) {
        return response.data
      } else {
        throw new Error('Crew planning failed.')
      }
    })
    .catch(error => {
      console.error('Error: Crew planning fetching data', error)
    })
}

const reloadCrewPlanning = async (vesselId: string) => {
  return API.get(
    `exploitation-vessel/${vesselId}/crewplanning?date=${moment(
      new Date()
    ).format('YYYY-MM-DD')}`
  )
    .then(response => {
      if (response.data) {
        return response.data
      } else {
        throw new Error('Crew planning failed.')
      }
    })
    .catch(error => {
      console.error('Error: Crew planning fetching data', error)
    })
}

const reloadUserRoles = async () => {
  return API.get(`roles`)
    .then(response => {
      if (response.data) {
        return response.data
      } else {
        throw new Error('User roles failed.')
      }
    })
    .catch(error => {
      console.error('Error: User roles fetching data', error)
    })
}

const createNewUser = async (entityId: any, user: any) => {
  return API.post(`entity_users`, {
    user: {
      username: `${user.lastname
        .toLowerCase()
        .replace(/ /g, '')}.${user.firstname.toLowerCase().replace(/ /g, '')}`,
      firstname: user.firstname,
      lastname: user.lastname,
      email: user.email,
      birthday: user.birthdate,
      plainPassword: 'vemasys001',
      enabled: true
    },
    entity: {
      id: parseInt(entityId)
    },
    role: {
      id: parseInt(user.roles)
    },
    startDate: new Date(),
    userAcceptationDate: new Date(),
    entityAcceptationDate: new Date(),
    hasUserAccepted: true,
    hasEntityAccepted: true
  })
    .then(response => {
      if (response.data) {
        return response.data
      } else {
        throw new Error('User creation failed.')
      }
    })
    .catch(error => {
      console.error('Error: User creation data', error)
    })
}

export {reloadCrew, reloadCrewPlanning, reloadUserRoles, createNewUser}
