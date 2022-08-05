import create from 'zustand'
import {persist} from 'zustand/middleware'
import AsyncStorage from '@react-native-async-storage/async-storage'
import * as API from '@bluecentury/api/vemasys'
import {TCredentials, TUser} from '@bluecentury/api/models'

type AuthState = {
  hasAuthHydrated: boolean
  token: string | undefined
  refreshToken: string | undefined
  errorMessage: string
  isAuthenticatingUser: boolean
  hasAuthenticationError: boolean
  isLoggingOut: boolean
  hasErrorLogout: boolean
}

type AuthActions = {
  authenticate: (credentials: TCredentials) => void
  setHasHydrated: (state: boolean) => void
  logout: () => void
}

type AuthStore = AuthState & AuthActions

export const useAuth = create(
  persist<AuthStore>(
    set => ({
      hasAuthHydrated: false,
      token: undefined,
      refreshToken: undefined,
      isAuthenticatingUser: false,
      errorMessage: '',
      hasAuthenticationError: false,
      isLoggingOut: false,
      hasErrorLogout: false,
      authenticate: async credentials => {
        set({
          token: undefined,
          refreshToken: undefined,
          isAuthenticatingUser: true,
          isLoggingOut: false,
          hasAuthenticationError: false
        })
        try {
          const response: TUser = await API.login(credentials)
          set({
            token: response.token,
            refreshToken: response.refreshToken,
            isAuthenticatingUser: false,
            hasAuthenticationError: false
          })
        } catch (error: any) {
          set({
            token: undefined,
            refreshToken: undefined,
            errorMessage: error,
            isAuthenticatingUser: false,
            hasAuthenticationError: true
          })
        }
      },
      logout: async () => {
        set({
          token: undefined,
          refreshToken: undefined,
          isLoggingOut: false,
          hasAuthenticationError: false
        })
      },
      setHasHydrated: state => {
        set({
          hasAuthHydrated: state
        })
      }
    }),
    {
      name: 'auth-storage',
      getStorage: () => AsyncStorage,
      onRehydrateStorage: () => state => {
        state?.setHasHydrated(true)
      }
    }
  )
)
