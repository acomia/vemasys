import {create} from 'apisauce'
import {API_URL} from '@bluecentury/env'
import {dataToCamelCase} from './transformers/response'

export const API = create({
  baseURL: API_URL,
  headers: {
    Accept: 'application/json',
    'content-type': 'application/json'
  }
})

API.addResponseTransform(dataToCamelCase)
