import axios from 'axios'
import {useAuth, useSettings} from '@bluecentury/stores'
import {API} from '../../apiService'
import {API_URL} from '@vemasys/env'
import * as Keychain from 'react-native-keychain'

const UNAUTHENTICATED = 401

export const onFailedResponse = async (error: any) => {
  const failedRequest = error?.config
  const errorUrl = failedRequest?.url
  console.log('ERROR_URL', errorUrl)
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
    console.log('UNAUTH')
    console.log('FAILED_RESP_API_URL', API_URL)
    try {
      // reset the token using the refresh_token
      await useAuth.getState().resetToken()
      // use the updated token
      const token = useAuth.getState().token
      API.defaults.headers.common = {
        ...API.defaults.headers.common,
        'Jwt-Auth': `Bearer ${token}`,
      }
      // continue with the previous request
      return API(failedRequest)
    } catch (err) {
      console.log('Error: Failed to Refresh Token ', err)
      const credentials = await Keychain.getGenericPassword()
      const isRemainLoggedIn = useSettings.getState().isRemainLoggedIn

      // check whether user desired to remain logged in
      // or has stored credentials
      if (!isRemainLoggedIn || credentials === false) {
        useAuth.getState().logout() // log user out
        return Promise.reject(err) // handle (reject) the request
      }

      const res = await axios.post(`${API_URL}login_check`, {
        username: credentials.username,
        password: credentials.password,
      })

      if (res.status === 200) {
        useAuth.getState().setUser({
          token: res.data.token,
          refreshToken: res.data.refreshToken,
        })
        API.defaults.headers.common = {
          ...API.defaults.headers.common,
          'Jwt-Auth': `Bearer ${res.data.token}`,
        }
        return API(failedRequest)
      }
    }
  }
  return Promise.reject(error)
}
