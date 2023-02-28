import {API} from '@bluecentury/api/apiService'
import {UserRegistration} from '@bluecentury/models'

export const registerNewUser = async (user: UserRegistration) => {
  try {
    const response = await API.post('register', user)
    if (!response.data) {
      throw 'Failed to get user information.'
    }
    return response.data
  } catch (error) {
    console.log('Error: getUserInfo', error)
    return null
  }
}
