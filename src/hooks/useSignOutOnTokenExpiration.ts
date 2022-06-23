import {API} from '@bluecentury/api/apiService'
import {useAuth} from '@bluecentury/stores'

/**
 * useSignOutOnTokenExpiration
 * Monitor for expired/unauthenticated token
 * and signout
 */
export const useSignOutOnTokenExpiration = () => {
  API.addMonitor(response => {
    if (response.status === 401) {
      useAuth.getState().logout()
    }
  })
}
