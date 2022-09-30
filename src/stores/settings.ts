import create from 'zustand'
import {persist} from 'zustand/middleware'
import AsyncStorage from '@react-native-async-storage/async-storage'
import {Environments} from '@bluecentury/constants'

type TEnv = keyof typeof Environments

type SettingsState = {
  isRemainLoggedIn: boolean
  env: string | undefined
  apiUrl: string | undefined
  isDarkMode: boolean
  language: string
  isMobileTracking: boolean
  hasSettingsRehydrated: boolean
}

type SettingsActions = {
  setEnv: (env: TEnv) => void
  setDarkMode: (val: boolean) => void
  setLanguage: (lang: string) => void
  setIsMobileTracking: (val: boolean) => void
  setHasHydrated: (val: boolean) => void
  setIsRemainLoggedIn: (isRemainLoggedIn: boolean) => void
}

type SettingsStore = SettingsState & SettingsActions

export const useSettings = create(
  persist<SettingsStore>(
    set => ({
      isRemainLoggedIn: false,
      env: undefined,
      apiUrl: undefined,
      isDarkMode: false,
      language: 'en',
      isMobileTracking: false,
      hasSettingsRehydrated: false,
      setDarkMode: async darkMode => {
        set({
          isDarkMode: darkMode,
        })
      },
      setLanguage: lang => {
        set({language: lang})
      },
      setIsMobileTracking: val => {
        set({
          isMobileTracking: val,
        })
      },
      setEnv: env => {
        const url = Environments[env]
        set({
          env: env,
          apiUrl: url,
        })
      },
      setIsRemainLoggedIn: isRemainLoggedIn => {
        set({isRemainLoggedIn: isRemainLoggedIn})
      },
      setHasHydrated: val => {
        set({hasSettingsRehydrated: val})
      },
    }),
    {
      name: 'settings-storage',
      getStorage: () => AsyncStorage,
      onRehydrateStorage: () => state => {
        state?.setHasHydrated(true)
      },
    }
  )
)
