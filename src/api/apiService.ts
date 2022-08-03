import axios from 'axios'
import {API_URL} from '@bluecentury/env'
import {onFailedResponse, onSuccessfulResponse} from './interceptors'
import {useAuth, useEntity} from '@bluecentury/stores'

export const API = axios.create({
  baseURL: API_URL,
  headers: {
    Accept: 'application/json',
    'content-type': 'application/json'
  }
})

// API.interceptors.request.use(paramsToSnakeCase)
// API.addResponseTransform(dataToCamelCase)
API.interceptors.response.use(onSuccessfulResponse, onFailedResponse)
API.interceptors.request.use(async req => {
  const token = useAuth.getState().token
  const entityId = useEntity.getState().entityId

  if (!token) {
    return req
  }
  req.headers = {
    ...req.headers,
    'Jwt-Auth': `Bearer ${token}`
  }

  if (typeof entityId !== 'undefined') {
    req.headers = {
      ...req.headers,
      'X-active-entity-user-id': `${entityId}`
    }
  }
  if (__DEV__) {
    console.log('Request Url: ', req.url)
  }
  return req
})
