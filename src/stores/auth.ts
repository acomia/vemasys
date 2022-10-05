import create from 'zustand'
import {persist} from 'zustand/middleware'
import AsyncStorage from '@react-native-async-storage/async-storage'
import * as API from '@bluecentury/api/vemasys'
import {Credentials, Auth} from 'src/models'
import * as Keychain from 'react-native-keychain'

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
  authenticate: (credentials: Credentials) => void
  setUser: (obj: any) => void
  setHasHydrated: (state: boolean) => void
  logout: () => void
}

type AuthStore = AuthState & AuthActions

const initialState: AuthState = {
  hasAuthHydrated: false,
  token: undefined,
  refreshToken: undefined,
  isAuthenticatingUser: false,
  errorMessage: '',
  hasAuthenticationError: false,
  isLoggingOut: false,
  hasErrorLogout: false,
}

export const useAuth = create(
  persist<AuthStore>(
    set => ({
      ...initialState,
      authenticate: async credentials => {
        set({
          token: undefined,
          refreshToken: undefined,
          isAuthenticatingUser: true,
          isLoggingOut: false,
          hasAuthenticationError: false,
        })
        try {
          const response: Auth = await API.login(credentials)
          set({
            token: response.token,
            refreshToken: response.refreshToken,
            isAuthenticatingUser: false,
            hasAuthenticationError: false,
          })
          await Keychain.setGenericPassword(
            credentials.username,
            credentials.password
          )
        } catch (error: any) {
          set({
            token: undefined,
            refreshToken: undefined,
            errorMessage: error,
            isAuthenticatingUser: false,
            hasAuthenticationError: true,
          })
        }
      },
      setUser: obj => {
        set({
          token: obj.token,
          refreshToken: obj.refreshToken,
        })
      },
      logout: async () => {
        set({
          ...initialState,
          token: undefined,
          hasAuthHydrated: true,
        })
      },
      setHasHydrated: state => {
        set({
          hasAuthHydrated: state,
        })
      },
    }),
    {
      name: 'auth-storage',
      getStorage: () => AsyncStorage,
      onRehydrateStorage: () => state => {
        state?.setHasHydrated(true)
      },
    }
  )
)
