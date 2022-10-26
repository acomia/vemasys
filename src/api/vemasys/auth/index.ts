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

const refresh = async (refreshToken: string) => {
  return API.post('token/refresh', {refresh_token: refreshToken})
    .then(response => {
      return response.data
    })
    .catch(error => {
      console.log('REFRESH_ERROR', error.toJSON())
      return error
    })
}

export {login, logout, refresh}
