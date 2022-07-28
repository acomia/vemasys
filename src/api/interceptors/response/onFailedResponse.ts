import axios from 'axios'
import {useAuth} from '@bluecentury/stores'
import {API} from '../../apiService'
import {API_URL} from '@bluecentury/env'

const UNAUTHENTICATED = 401

export const onFailedResponse = async (error: any) => {
  // DO anything here
  console.log('Error data: ', error?.response.data)
  console.log('Error status: ', error?.response.status)
  console.log('Error request url: ', error?.config.url)
  const failedRequest = error?.config

  if (error?.response?.status === UNAUTHENTICATED) {
    console.log('test')
    try {
      const refreshToken = useAuth.getState().refreshToken
      const res = await axios.post(
        `${API_URL}/token/refresh?refresh_token=${refreshToken}`
      )
      if (res) {
        console.log('res ', res)
        failedRequest.defaults.headers = {
          ...failedRequest.defaults.headers,
          'Jwt-Auth': `Bearer ${res.data.token}`
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
