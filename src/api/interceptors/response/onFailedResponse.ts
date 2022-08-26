import axios from 'axios'
import {useAuth} from '@bluecentury/stores'
import {API} from '../../apiService'
import {API_URL} from '@vemasys/env'

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
          'Jwt-Auth': res.data.token
        }
        return API(failedRequest)
      }
    } catch (err) {
      console.log('Error: Failed to Refresh Token ', err)
      useAuth.getState().logout()
      return Promise.reject(err)
    }
  }
  return Promise.reject(error)
}
