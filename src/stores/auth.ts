import create from 'zustand'
import {persist} from 'zustand/middleware'
import AsyncStorage from '@react-native-async-storage/async-storage'
import * as API from '@bluecentury/api/vemasys'
import {TCredentials} from '@bluecentury/api/models'

type AuthState = {
  _hasHydrated: boolean
  token: string | undefined
  refreshToken: string | undefined
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
    (set, get) => ({
      _hasHydrated: false,
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
      setHasHydrated: state => {
        set({
          _hasHydrated: state
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
