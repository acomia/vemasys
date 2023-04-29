import create from 'zustand'
import {persist} from 'zustand/middleware'
import AsyncStorage from '@react-native-async-storage/async-storage'
import {Environments} from '@bluecentury/constants'
import i18next from 'i18next'
import * as API from '@bluecentury/api/vemasys'
import {useEntity} from '@bluecentury/stores/entity'

type TEnv = keyof typeof Environments

type TableItem = {
  draught: number
  tonnage: number
}

type SettingsState = {
  rememberMe: boolean
  env: string | undefined
  apiUrl: string | undefined
  isDarkMode: boolean
  language: string | undefined
  isMobileTracking: boolean
  hasSettingsRehydrated: boolean
  isQrScanner: boolean
  isOnline: boolean
  draughtTable: TableItem[]
}

type SettingsActions = {
  setEnv: (env: TEnv) => void
  setDarkMode: (val: boolean) => void
  setLanguage: (lang: string, shouldUpdateBackEnd?: boolean) => void
  setIsMobileTracking: (val: boolean) => void
  setHasHydrated: (val: boolean) => void
  setRememberMe: (rememberMe: boolean) => void
  setIsQrScanner: (val: boolean) => void
  setIsOnline: (val: boolean) => void
  setDraughtTable: (val: TableItem[]) => void
}

type SettingsStore = SettingsState & SettingsActions

export const useSettings = create(
  persist<SettingsStore>(
    set => ({
      rememberMe: true,
      env: undefined,
      apiUrl: undefined,
      isDarkMode: false,
      language: undefined,
      isMobileTracking: false,
      hasSettingsRehydrated: false,
      isQrScanner: true,
      isOnline: true,
      draughtTable: [],
      setDarkMode: async darkMode => {
        set({
          isDarkMode: darkMode,
        })
      },
      setLanguage: async (lang, shouldUpdateBackEnd) => {
        set({language: lang})
        i18next.changeLanguage(lang)
        const user = useEntity.getState().user
        if (user && shouldUpdateBackEnd) {
          await API.changeUserLanguage(user.id, lang)
        }
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
      setRememberMe: rememberMe => {
        set({rememberMe: rememberMe})
      },
      setHasHydrated: val => {
        set({hasSettingsRehydrated: val})
      },
      setIsQrScanner: val => {
        set({isQrScanner: val})
      },
      setIsOnline: val => {
        set({isOnline: val})
      },
      setDraughtTable: val => {
        set({draughtTable: val})
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
