import create from 'zustand'
import {persist} from 'zustand/middleware'
import AsyncStorage from '@react-native-async-storage/async-storage'

import * as API from '@bluecentury/api/vemasys'
import {
  UPDATE_CHARTER_FAILED,
  UPDATE_CHARTER_SUCCESS,
  UPLOAD_CHARTER_SIGNATURE_FAILED,
  UPLOAD_CHARTER_SIGNATURE_SUCCESS,
} from '@bluecentury/constants'
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
  updateCharterStatusResponse: string
  uploadCharterSignatureResponse: string
}

type ChartersActions = {
  getCharters: () => void
  viewPdf?: (charterId: string) => void
  updateCharterStatus?: (charterId: string, status: IUpdateStatus) => void
  uploadSignature?: (signature: ISignature) => void
  resetResponses?: () => void
}

type ChartersStore = ChartersState & ChartersActions

export const useCharters = create(
  persist<ChartersStore>(
    (set, get) => ({
      isCharterLoading: false,
      charters: [],
      pdfPath: '',
      updateCharterStatusResponse: '',
      uploadCharterSignatureResponse: '',
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
        set({isCharterLoading: true})
        try {
          const response = await API.updateCharterStatus(charterId, status)
          if (typeof response === 'string') {
            set({
              isCharterLoading: false,
              updateCharterStatusResponse: UPDATE_CHARTER_SUCCESS,
            })
          } else {
            set({
              isCharterLoading: false,
              updateCharterStatusResponse: UPDATE_CHARTER_FAILED,
            })
          }
        } catch (error) {
          set({isCharterLoading: false})
        }
      },
      uploadSignature: async (signature: ISignature) => {
        set({isCharterLoading: true})
        try {
          const response = await API.uploadSignature(signature)
          if (typeof response === 'object') {
            set({
              isCharterLoading: false,
              uploadCharterSignatureResponse: UPLOAD_CHARTER_SIGNATURE_SUCCESS,
            })
          } else {
            set({
              isCharterLoading: false,
              uploadCharterSignatureResponse: UPLOAD_CHARTER_SIGNATURE_FAILED,
            })
          }
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
