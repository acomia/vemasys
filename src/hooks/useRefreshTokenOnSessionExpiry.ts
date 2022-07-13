import {API} from '@bluecentury/api/apiService'
import {useAuth} from '@bluecentury/stores'

/**
 * useRefreshTokenOnSessionExpiration
 * Monitor for expired/unauthenticated token
 * and refresh token
 */
export const useRefreshTokenOnSessionExpiry = () => {
  const {refreshToken, logout} = useAuth.getState()
  if (typeof refreshToken !== 'undefined') {
    logout()
  }

  API.addMonitor(response => {
    if (response.status === 401) {
      API.deleteHeader('Jwt-Auth')
      API.post(`token/refresh?refresh_token=${refreshToken}`)
        .then(res => {
          console.log('refreshToken result ', res)
        })
        .catch(error => {
          console.log('Error refreshToken: ', error)
        })
    }
  })
}
