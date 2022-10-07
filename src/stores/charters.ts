import create from 'zustand'
import {persist} from 'zustand/middleware'
import AsyncStorage from '@react-native-async-storage/async-storage'
import * as API from '@bluecentury/api/vemasys'
interface IUpdateStatus {
  status?: string
  setContractorStatus?: boolean
}
interface ISignature {
  user: string
  signature: string
  signedDate: Date
  charter: string
}

type ChartersState = {
  charters: [] | undefined
  isCharterLoading: boolean
  pdfPath: string
  updateCharterStatusResponse: StringOrNull
  uploadCharterSignatureResponse: StringOrNull
}

type ChartersActions = {
  getCharters: () => void
  viewPdf: (charterId: string) => void
  updateCharterStatus: (charterId: string, status: IUpdateStatus) => void
  uploadSignature: (signature: ISignature) => void
  resetResponses: () => void
}

type ChartersStore = ChartersState & ChartersActions

export const useCharters = create(
  persist<ChartersStore>(
    (set, get) => ({
      isCharterLoading: false,
      charters: [],
      pdfPath: '',
      updateCharterStatusResponse: null,
      uploadCharterSignatureResponse: null,
      getCharters: async () => {
        set({isCharterLoading: true, charters: []})
        try {
          const response = await API.reloadVesselCharters()
          if (Array.isArray(response)) {
            set({
              isCharterLoading: false,
              charters: response,
            })
          } else {
            set({
              isCharterLoading: false,
              charters: [],
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
      updateCharterStatus: async (charterId: string, status: IUpdateStatus) => {
        set({
          isCharterLoading: true,
          updateCharterStatusResponse: null,
        })
        try {
          const response = await API.updateCharterStatus(charterId, status)
          set({
            isCharterLoading: false,
            updateCharterStatusResponse: response,
          })
        } catch (error) {
          set({isCharterLoading: false})
        }
      },
      uploadSignature: async (signature: ISignature) => {
        set({
          isCharterLoading: true,
          uploadCharterSignatureResponse: null,
        })
        try {
          const response = await API.uploadSignature(signature)
          set({
            isCharterLoading: false,
            uploadCharterSignatureResponse: response,
          })
        } catch (error) {
          set({isCharterLoading: false})
        }
      },
      resetResponses: () => {
        set({
          updateCharterStatusResponse: '',
          uploadCharterSignatureResponse: '',
        })
      },
    }),
    {
      name: 'charters-storage',
      getStorage: () => AsyncStorage,
    }
  )
)
