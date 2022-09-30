import axios from 'axios'
import {useAuth, useSettings} from '@bluecentury/stores'
import {API} from '../../apiService'
import {API_URL} from '@vemasys/env'
import * as Keychain from 'react-native-keychain'

const UNAUTHENTICATED = 401

export const onFailedResponse = async (error: any) => {
  const failedRequest = error?.config
  const errorUrl = failedRequest?.url
  let failedRequestHeaders = failedRequest.headers || undefined
  // DO anything here
  console.log('Error data: ', error?.response.data)
  console.log('Error status: ', error?.response.status)
  console.log('Error request url: ', errorUrl)
  console.log(
    'Error request headers: ',
    failedRequestHeaders['X-active-entity-user-id']
  )

  const isLogin = errorUrl === 'login_check'

  if (error?.response?.status === UNAUTHENTICATED && !isLogin) {
    try {
      const refreshToken = useAuth.getState().refreshToken
      const res = await axios.post(
        `${API_URL}token/refresh?refresh_token=${refreshToken}`
      )
      if (res) {
        API.defaults.headers.common = {
          ...API.defaults.headers.common,
          'Jwt-Auth': res.data.token,
        }
        return API(failedRequest)
      }
    } catch (err) {
      console.log('Error: Failed to Refresh Token ', err)
      if (useSettings.getState().isRemainLoggedIn) {
        const credentials = await Keychain.getGenericPassword()
        if (credentials) {
          console.log('credentials ')
          const {username, password} = credentials
          const res = await axios.post(`${API_URL}login_check`, {
            username: username,
            password: password,
          })
          console.log('res using stored', res.data.token)
          if (res) {
            API.defaults.headers.common = {
              ...API.defaults.headers.common,
              'Jwt-Auth': res.data.token,
            }
            useAuth.getState().setUser({
              token: res.data.token,
              refreshToken: res.data.refreshToken,
            })
            return API(failedRequest)
          }
        }
      }
      useAuth.getState().logout()
      return Promise.reject(err)
    }
  }
  return Promise.reject(error)
}
