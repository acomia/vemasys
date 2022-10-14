import create from 'zustand'
import {persist} from 'zustand/middleware'
import AsyncStorage from '@react-native-async-storage/async-storage'

import * as API from '@bluecentury/api/vemasys'
import {getSignature} from "@bluecentury/api/vemasys";
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

interface SignedDocument {
  charter_id: string
  path: string
}

type ChartersState = {
  charters: [] | undefined
  isCharterLoading: boolean
  pdfPath: string
  signatureId: string
  signedDocumentsArray: SignedDocument[]
}

type ChartersActions = {
  getCharters: () => void
  viewPdf: (charterId: string) => void
  updateCharterStatus: (charterId: string, status: IUpdateStatus) => void
  uploadSignature: (signature: ISignature) => void
  setSignatureId: (signatureId: string) => void
  addSignedDocument: (document: SignedDocument[]) => void
  getSignature: (signatureId: string, callback: Function) => void
}

type ChartersStore = ChartersState & ChartersActions

export const useCharters = create(
  persist<ChartersStore>(
    (set, get) => ({
      isCharterLoading: false,
      charters: [],
      pdfPath: '',
      signatureId: '',
      signedDocumentsArray: [],
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
          console.log('VIEW_PDF_RESP', response)
          return response.data
        } catch (error) {
          set({isCharterLoading: false})
        }
      },
      updateCharterStatus: async (charterId: string, status: IUpdateStatus) => {
        set({isCharterLoading: true})
        try {
          const response = await API.updateCharterStatus(charterId, status)
          set({isCharterLoading: false})
          return response
        } catch (error) {
          set({isCharterLoading: false})
        }
      },
      uploadSignature: async (signature: ISignature) => {
        set({isCharterLoading: true})
        try {
          const response = await API.uploadSignature(signature)
          set({isCharterLoading: false})
          return response
        } catch (error) {
          set({isCharterLoading: false})
        }
      },
      setSignatureId: (signatureId: string) => {
        set({signatureId})
      },
      addSignedDocument: signedDocuments => {
        set({signedDocumentsArray: signedDocuments})
      },
      getSignature: async (signatureId, callback) => {
        try {
          const response = await API.getSignature(signatureId)
          return response
        } catch (error) {
          console.log('GET_SIGNATURE_ERROR', error)
          callback()
        }
      },
    }),
    {
      name: 'charters-storage',
      getStorage: () => AsyncStorage,
    }
  )
)
