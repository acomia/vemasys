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
              refreshToken: res?.refreshToken,
              isAuthenticatingUser: false,
              hasAuthenticationError: false
            })
            return Promise.resolve(get().token)
          } else {
            set({
              token: undefined,
              refreshToken: undefined,
              isAuthenticatingUser: false,
              hasAuthenticationError: false
            })
            return Promise.resolve(false)
          }
        } catch (error) {
          console.log('Error stores>auth>resetToken* ', error)
          set({
            isAuthenticatingUser: false,
            hasAuthenticationError: true
          })
          return Promise.resolve(false)
        }
      }
    }),
    {
      name: 'auth-storage',
      getStorage: () => AsyncStorage
    }
  )
)
