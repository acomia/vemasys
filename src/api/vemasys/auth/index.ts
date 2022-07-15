import {API} from '../../apiService'
import {TCredentials, TUser} from '@bluecentury/api/models'

const login = (userCredentials: TCredentials) => {
  API.deleteHeader('Jwt-Auth')
  return API.post<TUser>('login_check', userCredentials)
    .then(response => {
      // Set future request Authorization
      if (response.data) {
        // Set future request Authorization
        API.setHeader('Jwt-Auth', `Bearer ${response.data.token}`)
        return response.data
      } else {
        throw new Error('Authentication failed.')
      }
    })
    .catch(error => {
      console.error('Error: API Login ', error)
    })
}

const logout = (userCredentials: TCredentials) => {
  return API.post<TUser>('login', userCredentials)
    .then(response => {
      if (response.data) {
        API.deleteHeader('Jwt-Auth')
        return response.data
      } else {
        throw new Error('Request Failed')
      }
    })
    .catch(error => {
      console.error('Error: API Logout ', error)
    })
}

const resetToken = (refreshToken: string) => {
  API.setHeaders({
    Accept: 'application/json',
    'Content-Type': 'multipart/form-data'
  })
  return API.post<TUser>(`token/refresh?refresh_token=${refreshToken}`)
    .then(response => {
      if (response.data) {
        API.setHeader('Jwt-Auth', `Bearer ${response.data.token}`)
        return response.data
      } else {
        throw new Error('Request Failed')
      }
    })
    .catch(error => {
      console.error('Error: API Reset Token ', error)
    })
    .finally(() => {
      API.setHeader('Content-Type', 'application/json')
    })
}

export {login, logout, resetToken}
