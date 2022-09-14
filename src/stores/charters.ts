import create from 'zustand'
import {persist} from 'zustand/middleware'
import AsyncStorage from '@react-native-async-storage/async-storage'

import * as API from '@bluecentury/api/vemasys'
interface UpdateStatus {
  status?: string
  setContractorStatus?: boolean
}

type ChartersState = {
  charters: [] | undefined
  isCharterLoading: boolean
  pdfPath: string
}

type ChartersActions = {
  getCharters: () => void
  viewPdf?: (charterId: string) => void
  updateCharterStatus?: (charterId: string, status: UpdateStatus) => void
}

type ChartersStore = ChartersState & ChartersActions

export const useCharters = create(
  persist<ChartersStore>(
    (set, get) => ({
      isCharterLoading: false,
      charters: [],
      pdfPath: '',
      getCharters: async () => {
        set({isCharterLoading: true, charters: []})
        try {
          const response = await API.reloadVesselCharters()
          if (Array.isArray(response)) {
            set({
              isCharterLoading: false,
              charters: response
            })
          } else {
            set({
              isCharterLoading: false,
              charters: []
            })
          }
        } catch (error) {
          set({isCharterLoading: false})
        }
      },
      viewPdf: async (charterId: string) => {
        set({isCharterLoading: true})
        try {
          const response = await API.viewPdfFile(charterId)
          set({isCharterLoading: false})
          return response.data
        } catch (error) {
          set({isCharterLoading: false})
        }
      },
      updateCharterStatus: async (charterId: string, status: UpdateStatus) => {
        set({isCharterLoading: true})
        try {
          const response = await API.updateCharterStatus(charterId, status)
          set({isCharterLoading: false})
          return response
        } catch (error) {
          set({isCharterLoading: false})
        }
      }
    }),
    {
      name: 'charters-storage',
      getStorage: () => AsyncStorage
    }
  )
)
