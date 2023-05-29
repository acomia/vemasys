import create from 'zustand'
import {persist} from 'zustand/middleware'
import AsyncStorage from '@react-native-async-storage/async-storage'
import {Environments} from '@bluecentury/constants'
import i18next from 'i18next'
import * as API from '@bluecentury/api/vemasys'
import {useEntity} from '@bluecentury/stores/entity'
import {calculateTable, recalculateTable} from '@bluecentury/utils'

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
  tonnageCertificationID: number | null
  uploadedTableData: any
  isDraughtTableLoading: boolean
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
  getDraughtTable: (id: string) => void
  updateDraughtTable: (measurement: TableItem, id?: number) => void
  removeResponse: (id: number) => void
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
      tonnageCertificationID: null,
      uploadedTableData: [],
      isDraughtTableLoading: false,
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
      getDraughtTable: async id => {
        set({isDraughtTableLoading: true})
        const uploadedTableData: DraughtTableItem[] =
          await API.getTonnageCertification(id)
        const sortedData = uploadedTableData.sort((a, b) => {
          return parseFloat(a.draught) - parseFloat(b.draught)
        })
        if (uploadedTableData && uploadedTableData.length) {
          set({uploadedTableData: sortedData})
          const initialTable = calculateTable(
            parseFloat(sortedData[sortedData.length - 1].tonnage),
            parseFloat(sortedData[0].tonnage),
            parseFloat(sortedData[sortedData.length - 1].draught),
            parseFloat(sortedData[0].draught)
          )
          if (uploadedTableData.length > 2) {
            const uploadedTableUserData = sortedData
              .map((item, index) => {
                if (index !== 0 && index !== uploadedTableData.length - 1) {
                  return {
                    draught: parseFloat(item.draught),
                    tonnage: parseFloat(item.tonnage),
                  }
                }
              })
              .filter(item => item !== undefined)
            recalculateTable(uploadedTableUserData as TableItem[], initialTable)
          }
          if (uploadedTableData.length === 2) {
            set({draughtTable: initialTable})
          }
          set({isDraughtTableLoading: false})
        } else {
          set({
            isDraughtTableLoading: false,
          })
        }
      },
      updateDraughtTable: async (measurement, id?) => {
        if (id) {
          return await API.putTonnageCertification(measurement, id)
        }
        return await API.postTonnageCertification(measurement)
      },
      removeResponse: async id => {
        return await API.removeTonnageCertification(id)
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
