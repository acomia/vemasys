import create from 'zustand'
import {persist} from 'zustand/middleware'
import AsyncStorage from '@react-native-async-storage/async-storage'
import * as API from '@bluecentury/api/vemasys'
import {
  getSignature,
  linkSignPDFToCharter,
  uploadImgFile,
} from '@bluecentury/api/vemasys'
import {Charter} from '@bluecentury/models'
import {getCharterStatus} from '@bluecentury/constants'
import {useEntity} from '@bluecentury/stores/entity'

interface IUpdateStatus {
  status?: string
  setContractorStatus?: boolean
}

interface ISignature {
  user: string
  signature: StringOrNull
  signedDate: StringOrNull
  charter: string
}

interface SignedDocument {
  charter_id: string
  path: string
}

interface SignedPDF {
  uri: string
  type: string
  fileName: string
}

type ChartersState = {
  charters: Array<Charter>
  timeCharters: Array<Charter>
  isCharterLoading: boolean
  pdfPath: string
  updateCharterStatusResponse: StringOrNull
  uploadCharterSignatureResponse: StringOrNull
  signatureId: string
  signedDocumentsArray: SignedDocument[]
  isCharterUpdateLoading: boolean
  isCharterUpdateSuccess: boolean
  isDocumentSigning: boolean
  chartersBadge: number
}

type ChartersActions = {
  getCharters: () => void
  viewPdf: (charterId: string) => void
  updateCharterStatus: (charterId: string, status: IUpdateStatus) => void
  uploadSignature: (signature: ISignature) => void
  resetResponses: () => void
  setSignatureId: (signatureId: string) => void
  addSignedDocument: (document: SignedDocument[]) => void
  getSignature: (signatureId: string, callback: Function) => void
  updateCharter: (charterId: string, data: any) => void
  setIsDocumentSigning: (value: boolean) => void
  uploadSignedPDF: (pdfFile: SignedPDF) => Promise<string>
  linkSignPDFToCharter: (
    path: string,
    description: string,
    charterID: number
  ) => Promise<string>
}

type ChartersStore = ChartersState & ChartersActions

export const useCharters = create(
  persist<ChartersStore>(
    (set, get) => ({
      isCharterLoading: false,
      charters: [],
      timeCharters: [],
      pdfPath: '',
      updateCharterStatusResponse: null,
      uploadCharterSignatureResponse: null,
      signatureId: '',
      signedDocumentsArray: [],
      isCharterUpdateLoading: false,
      isCharterUpdateSuccess: false,
      isDocumentSigning: false,
      chartersBadge: 0,
      getCharters: async () => {
        set({isCharterLoading: true, charters: []})
        try {
          const response = await API.reloadVesselCharters()
          if (Array.isArray(response)) {
            const chr = response.filter(
              (c: Charter) => c.children && c.children.length === 0
            )
            chr.forEach(ch => {
              ch.status = getCharterStatus(ch, useEntity.getState().entityType)

              set({
                charters: chr,
                chartersBadge: get().charters.filter(
                  charter => charter.status === 'new'
                ).length,
              })
            })
            const tchr = response.filter(
              (c: Charter) =>
                (c.children && c.children.length > 0) ||
                (!c.parent && !c.navigationLogs) ||
                c.navigationLogs.length === 0
            )
            tchr.forEach(ch => {
              ch.status = getCharterStatus(ch, useEntity.getState().entityType)
              set({timeCharters: tchr})
            })
            set({
              isCharterLoading: false,
            })
          } else {
            set({
              isCharterLoading: false,
              charters: [],
              timeCharters: [],
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
          return response
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
      resetResponses: () => {
        set({
          updateCharterStatusResponse: '',
          uploadCharterSignatureResponse: '',
        })
      },
      updateCharter: (charterId: string, data: any) => {
        set({isCharterUpdateLoading: true, isCharterUpdateSuccess: false})
        const response: any = API.updateCharter(charterId, data)
        if (response === 200) {
          set({isCharterUpdateSuccess: true, isCharterUpdateLoading: false})
        } else {
          set({isCharterUpdateSuccess: true, isCharterUpdateLoading: false})
        }
      },
      setIsDocumentSigning: value => {
        set({
          isDocumentSigning: value,
        })
      },
      uploadSignedPDF: async value => {
        try {
          const response = await API.uploadImgFile(value)
          return response
        } catch (e) {
          console.error('SIGNED_PDF_UPLOAD_ERROR', e)
          return 'FAILURE'
        }
      },
      linkSignPDFToCharter: async (path, description, charterID) => {
        try {
          await API.linkSignPDFToCharter(path, description, charterID)
          return 'SUCCESS'
        } catch (e) {
          console.error('LINKING_SINGED_DOCUMENT_TO_CHARTER_ERROR', e)
          return 'FAILURE'
        }
      },
    }),
    {
      name: 'charters-storage',
      getStorage: () => AsyncStorage,
    }
  )
)
