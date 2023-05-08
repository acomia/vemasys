import {API} from '@bluecentury/api/apiService'
import {ExtendedUser, SignupDocs, UserRegistration} from '@bluecentury/models'

export const registerNewUser = async (user: UserRegistration) => {
  try {
    const response = await API.post('register', user)
    if (!response.data) {
      throw 'Failed to create new user.'
    }
    return response.data
  } catch (error) {
    console.log('Error: Register new user:', error)
    return null
  }
}

export const updateUserData = async (
  user: ExtendedUser,
  docs: Array<SignupDocs>
) => {
  let updateUserRequest
  if (docs.length > 0) {
    updateUserRequest = Object.assign(
      {},
      {
        firstname: user.firstname,
        lastname: user.lastname,
        birthday: user.birthday,
        certificateLevel: Number(user.certificateLevel),
        language: user.language,
        email: user.email,
        username: user.username,
        professionalEmail: user.email,
      },
      ...docs.map(file => file)
    )
  }

  try {
    const response = await API.put(
      `users/${user.id.toString()}`,
      updateUserRequest
    )
    if (!response.data) {
      throw 'Failed to create new user.'
    }
    return response.data
  } catch (error) {
    console.log('Error: Update user info:', error)
    return null
  }
}

export const getEntityData = async (mmsi: number) => {
  try {
    const response = await API.get(
      `entities/anonymous?exploitationVessel.physicalVessel.mmsi=${mmsi}&page=1`
    )
    if (!response.data) {
      throw 'Failed to get entities data.'
    }
    return response.data
  } catch (error) {
    console.log('Error: Entities data:', error)
    return null
  }
}

export const requestAccessToEntity = async (entityID: string) => {
  try {
    const response = await API.post('entity_users/request_access_to_entity', {
      entity: entityID,
    })
    if (!response.data) {
      throw 'Failed to request access to entity.'
    }
    return response.data
  } catch (error) {
    console.log('Error: Request access to entity:', error)
    return null
  }
}

export const createSignupRequestForCurrentUser = async (
  user: ExtendedUser,
  docs: Array<SignupDocs>
) => {
  let signUpRequest
  signUpRequest = Object.assign(
    {},
    {
      mmsi: user.mmsi ? parseInt(user.mmsi) : null,
    }
  )
  if (docs.length > 0) {
    const tonnageDoc = docs.find(doc => doc.tonnageCertificate !== undefined)
    signUpRequest = Object.assign(
      {},
      {
        mmsi: user.mmsi ? parseInt(user.mmsi) : null,
      },
      tonnageDoc
    )
  }

  try {
    const response = await API.post(
      'signup_requests/create_for_current_user',
      signUpRequest
    )
    if (!response.data) {
      throw 'Failed to request signup for user.'
    }
    return response.data
  } catch (error) {
    console.log('Error: Signup request to current user:', error)
    return null
  }
}

export const getLevelOfNavigationCertificate = async () => {
  try {
    const response = await API.get('level_of_navigation_certificates')
    if (!response.data) {
      throw 'Failed to get level of navigation certificate data.'
    }
    return response.data
  } catch (error) {
    console.log('Error: Navigation certificate data:', error)
    return null
  }
}

export const getEntityAdminUser = async () => {
  try {
    const response = await API.get('level_of_navigation_certificates')
    if (!response.data) {
      throw 'Failed to get level of navigation certificate data.'
    }
    return response.data
  } catch (error) {
    console.log('Error: Navigation certificate data:', error)
    return null
  }
}
