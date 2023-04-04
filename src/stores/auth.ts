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
  isTokenRefresh: boolean
  authInterceptedRequests: any[]
}

type AuthActions = {
  authenticate: (credentials: Credentials) => void
  setUser: (obj: any) => void
  setHasHydrated: (state: boolean) => void
  logout: () => void
  resetToken: () => void
  // setIsTokenRefresh: (status: boolean) => void
  setAuthInterceptedRequests: (interceptedRequests: any[]) => void
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
  isTokenRefresh: false,
  authInterceptedRequests: [],
}

export const useAuth = create(
  persist<AuthStore>(
    (set, get) => ({
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
          if (response === 'Invalid credentials.') {
            set({
              hasAuthenticationError: true,
              isAuthenticatingUser: false,
              errorMessage: response,
            })
            return
          }
          console.log('TOKEN', response.token)
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
      resetToken: async () => {
        set({
          isTokenRefresh: true,
        })
        const refreshToken = get().refreshToken
        try {
          const res = await API.refresh(refreshToken)
          set({
            token: res.token,
            refreshToken: res.refreshToken,
            isTokenRefresh: false,
          })
        } catch (error) {
          console.log('RESET_TOKEN_ERROR', error)
          set({
            isTokenRefresh: false,
          })
        }
      },
      setAuthInterceptedRequests: interceptedRequests => {
        set({
          authInterceptedRequests: interceptedRequests,
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
