import create from 'zustand'
import {persist} from 'zustand/middleware'
import AsyncStorage from '@react-native-async-storage/async-storage'
import * as API from '@bluecentury/api/vemasys'
import {TCredentials} from '@bluecentury/api/models'

type AuthState = {
  token: string | undefined
  refreshToken: string | undefined
  isAuthenticatingUser: boolean
  hasAuthenticationError: boolean
  isLoggingOut: boolean
  hasErrorLogout: boolean
}

type AuthActions = {
  authenticate: (credentials: TCredentials) => void
  logout: () => void
  resetToken: () => Promise<any>
}

type AuthStore = AuthState & AuthActions

export const useAuth = create(
  persist<AuthStore>(
    (set, get) => ({
      token: undefined,
      refreshToken: undefined,
      isAuthenticatingUser: false,
      hasAuthenticationError: false,
      isLoggingOut: false,
      hasErrorLogout: false,
      authenticate: async credentials => {
        set({
          token: undefined,
          refreshToken: undefined,
          isAuthenticatingUser: true,
          hasAuthenticationError: false
        })
        try {
          const response = await API.login(credentials)
          console.log('login response ', response)
          set({
            token: response?.token,
            refreshToken: response?.refreshToken,
            isAuthenticatingUser: false,
            hasAuthenticationError: false
          })
        } catch (error) {
          set({
            token: undefined,
            refreshToken: undefined,
            isAuthenticatingUser: false,
            hasAuthenticationError: true
          })
        }
      },
      logout: async () => {
        set({
          token: undefined,
          refreshToken: undefined,
          isAuthenticatingUser: false,
          hasAuthenticationError: false
        })
      },
      resetToken: async () => {
        console.log('reset token')
        set({
          token: undefined,
          isAuthenticatingUser: true
        })
        try {
          const refreshToken = get().refreshToken
          if (typeof refreshToken !== 'undefined') {
            const res = await API.resetToken(refreshToken)
            console.log('reset token result ', res)
            set({
              token: res?.token,
              refreshToken: res?.refreshToken
            })
          }
          set({
            isAuthenticatingUser: false,
            hasAuthenticationError: false
          })
          return Promise.resolve(get().token)
        } catch (error) {
          console.log('Error stores>auth>resetToken* ', error)
          set({
            isAuthenticatingUser: false,
            hasAuthenticationError: true
          })
          return Promise.resolve(error)
        }
      }
    }),
    {
      name: 'auth-storage',
      getStorage: () => AsyncStorage
    }
  )
)
