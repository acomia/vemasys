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
}

type AuthActions = {
  authenticate: (credentials: TCredentials, callback: () => any) => void
  logout: () => void
}

type AuthStore = AuthState & AuthActions

export const useAuth = create<AuthStore>(set => ({
  token: undefined,
  refreshToken: undefined,
  isAuthenticatingUser: false,
  hasAuthenticationError: false,
  authenticate: async (credentials, callback) => {
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
      if (callback && typeof callback === 'function') {
        callback()
      }
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
    set(
      {
        token: undefined,
        refreshToken: undefined,
        isAuthenticatingUser: false,
        hasAuthenticationError: false
      },
      true
    )
  }
}))
