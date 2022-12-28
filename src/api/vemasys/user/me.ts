import {API} from '@bluecentury/api/apiService'
import {User} from '@bluecentury/models'

export const getUserInfo = async () => {
  try {
    const response = await API.get<User>('me')
    if (!response.data) {
      throw 'Failed to get user information.'
    }
    return response.data
  } catch (error) {
    console.log('Error: getUserInfo', error)
    return null
  }
}
