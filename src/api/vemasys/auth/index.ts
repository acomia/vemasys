import {API} from '../../apiService'
import {TCredentials, TUser} from '@bluecentury/api/models'

const login = (userCredentials: TCredentials) => {
  return API.post('login_check', userCredentials)
    .then(response => {
      return response.data
    })
    .catch(error => {
      return Promise.reject(error?.response.data.message)
    })
}

const logout = (userCredentials: TCredentials) => {
  return API.post<TUser>('login', userCredentials)
    .then(response => {
      return response.data
    })
    .catch(error => {
      console.log('Error: API Logout ', error)
      return Promise.reject(error)
    })
}

export {login, logout}
