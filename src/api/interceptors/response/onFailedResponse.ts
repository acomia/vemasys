import {API} from '../../apiService'

const UNAUTHENTICATED = 401

export const onFailedResponse = async (error: any) => {
  // DO anything here

  const failedRequest = error?.config

  if (error?.response?.status === UNAUTHENTICATED) {
    // REFRESH TOKEN HERE
    return API(failed)
  }
  return Promise.reject(error)
}
