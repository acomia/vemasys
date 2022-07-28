import {API} from '../../apiService'
import {TCredentials, TUser} from '@bluecentury/api/models'

const login = (userCredentials: TCredentials) => {
  return API.post<TUser>('login_check', userCredentials)
    .then(response => {
      return response.data
    })
    .catch(error => {
      console.error('Error: API Login ', error)
    })
}

const logout = (userCredentials: TCredentials) => {
  return API.post<TUser>('login', userCredentials)
    .then(response => {
      return response.data
    })
    .catch(error => {
      console.error('Error: API Logout ', error)
    })
}

export {login, logout}
