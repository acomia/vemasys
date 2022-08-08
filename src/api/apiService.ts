import axios from 'axios'
import {API_URL} from '@bluecentury/env'
import {onFailedResponse, onSuccessfulResponse} from './interceptors'
import {useAuth, useEntity} from '@bluecentury/stores'

export const API = axios.create({
  baseURL: API_URL,
  headers: {
    Accept: 'application/json'
    // 'Content-Type': 'application/json'
  }
})

// API.interceptors.request.use(paramsToSnakeCase)
// API.addResponseTransform(dataToCamelCase)
API.interceptors.response.use(onSuccessfulResponse, onFailedResponse)
API.interceptors.request.use(async req => {
  const token = useAuth.getState().token
  const entityUserId = useEntity.getState().entityUserId

  if (!token) {
    return req
  }
  req.headers = {
    ...req.headers,
    'Jwt-Auth': `Bearer ${token}`,
    'X-active-entity-user-id': `${entityUserId}`
  }
  if (__DEV__) {
    console.log('Request Url: ', req.url)
    console.log('X-active-entity-user-id: ', entityUserId)
  }
  return req
})
