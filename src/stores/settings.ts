import create from 'zustand'
import {persist} from 'zustand/middleware'
import AsyncStorage from '@react-native-async-storage/async-storage'
import {Environments} from '@bluecentury/constants'
import i18next from 'i18next'

type TEnv = keyof typeof Environments

type SettingsState = {
  isRemainLoggedIn: boolean
  env: string | undefined
  apiUrl: string | undefined
  isDarkMode: boolean
  language: string
  isMobileTracking: boolean
  hasSettingsRehydrated: boolean
  isQrScanner: boolean
}

type SettingsActions = {
  setEnv: (env: TEnv) => void
  setDarkMode: (val: boolean) => void
  setLanguage: (lang: string) => void
  setIsMobileTracking: (val: boolean) => void
  setHasHydrated: (val: boolean) => void
  setIsRemainLoggedIn: (isRemainLoggedIn: boolean) => void
  setIsQrScanner: (val: boolean) => void
}

type SettingsStore = SettingsState & SettingsActions

export const useSettings = create(
  persist<SettingsStore>(
    set => ({
      isRemainLoggedIn: true,
      env: undefined,
      apiUrl: undefined,
      isDarkMode: false,
      language: 'en',
      isMobileTracking: false,
      hasSettingsRehydrated: false,
      isQrScanner: true,
      setDarkMode: async darkMode => {
        set({
          isDarkMode: darkMode,
        })
      },
      setLanguage: lang => {
        set({language: lang})
        i18next.changeLanguage(lang)
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
      setIsQrScanner: val => {
        set({isQrScanner: val})
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
