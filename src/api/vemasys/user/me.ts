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

export const changeUserLanguage = async (id: number, lang: string) => {
  try {
    const response = await API.put(`users/${id}`, {language: lang})
    if (!response.data) {
      throw 'Failed to change user language.'
    }
    return response.data
  } catch (error) {
    console.log('Error: change user language', JSON.stringify(error))
    return null
  }
}
