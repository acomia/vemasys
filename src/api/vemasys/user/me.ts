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

export const changeUserLanguage = async (
  id: string,
  lang: string,
  user: User
) => {
  try {
    const changedUser = {...user, language: lang}
    const response = await API.put(`users/${id}`, changedUser)
    if (!response.data) {
      throw 'Failed to change user language.'
    }
    return response.data
  } catch (error) {
    console.log('Error: change user language', error)
    return null
  }
}
