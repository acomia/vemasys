import {API} from '../../apiService'
import {Credentials, Auth} from '@bluecentury/models'

const login = (userCredentials: Credentials) => {
  return API.post('login_check', userCredentials)
    .then(response => {
      return response.data
    })
    .catch(error => {
      return error?.response.data.message || 'Error'
    })
}

const logout = (userCredentials: Credentials) => {
  return API.post<Auth>('login', userCredentials)
    .then(response => {
      return response.data
    })
    .catch(error => {
      return error
    })
}

export {login, logout}
