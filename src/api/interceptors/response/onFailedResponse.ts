import axios from 'axios'
import {useAuth, useSettings} from '@bluecentury/stores'
import {API} from '../../apiService'
import {API_URL} from '@vemasys/env'
import * as Keychain from 'react-native-keychain'

const UNAUTHENTICATED = 401

export const onFailedResponse = async (error: any) => {
  const failedRequest = error?.config
  const errorUrl = failedRequest?.url
  const isTokenRefresh = useAuth.getState().isTokenRefresh
  // const setIsTokenRefresh = useAuth.getState().setIsTokenRefresh
  const authInterceptedRequests = useAuth.getState().authInterceptedRequests
  const setAuthInterceptedRequests =
    useAuth.getState().setAuthInterceptedRequests
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

  if (
    error?.response?.status === UNAUTHENTICATED &&
    !isLogin &&
    !isTokenRefresh
  ) {
    console.log('UNAUTH')
    try {
      // reset the token using the refresh_token
      await useAuth.getState().resetToken()
      // use the updated token
      const token = useAuth.getState().token
      console.log('NEW_TOKEN', token)
      API.defaults.headers.common = {
        ...API.defaults.headers.common,
        'Jwt-Auth': `Bearer ${token}`,
      }
      // continue with the previous request
      if (authInterceptedRequests.length) {
        authInterceptedRequests.forEach(request => {
          API(request)
        })
        setAuthInterceptedRequests([])
      }
      return API(failedRequest)
    } catch (err) {
      console.log('Error: Failed to Refresh Token ', err)
    }

    //This part should help us to ensure that refresh will called just once
    if (
      error?.response?.status === UNAUTHENTICATED &&
      !isLogin &&
      isTokenRefresh
    ) {
      setAuthInterceptedRequests([...authInterceptedRequests, failedRequest])
      console.log(
        'REQUEST_ADDED_TO_authInterceptedRequests',
        authInterceptedRequests.length
      )
    }
  }
  return Promise.reject(error)
}
