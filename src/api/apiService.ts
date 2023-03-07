import axios from 'axios'
import {onFailedResponse, onSuccessfulResponse} from './interceptors'
import {useAuth, useEntity, useSettings} from '@bluecentury/stores'

export const API = axios.create({
  headers: {
    Accept: 'application/json',
    // 'Content-Type': 'application/json'
  },
})

// API.interceptors.request.use(paramsToSnakeCase)
// API.addResponseTransform(dataToCamelCase)
API.interceptors.response.use(onSuccessfulResponse, onFailedResponse)
API.interceptors.request.use(async req => {
  req.baseURL = useSettings.getState().apiUrl
  const token = useAuth.getState().token
  const entityUserId = useEntity.getState().entityUserId

  if (!token) {
    return req
  }
  req.headers = {
    ...req.headers,
    'Jwt-Auth': `Bearer ${token}`,
    'X-active-entity-user-id': `${entityUserId}`,
  }
  if (__DEV__) {
    const requestUrl = req.url?.split('?')[0]
    console.log(
      `Request URL (${useSettings.getState().env}): api/${requestUrl}`
    )
  }
  return req
})
