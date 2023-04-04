import create from 'zustand'
import {persist} from 'zustand/middleware'
import AsyncStorage from '@react-native-async-storage/async-storage'
import * as API from '@bluecentury/api/vemasys'
import {getSignature, linkSignPDFToCharter, uploadImgFile} from '@bluecentury/api/vemasys'
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
  charters: [] | undefined
  isCharterLoading: boolean
  pdfPath: string
  updateCharterStatusResponse: StringOrNull
  uploadCharterSignatureResponse: StringOrNull
  signatureId: string
  signedDocumentsArray: SignedDocument[]
  isCharterUpdateLoading: boolean
  isCharterUpdateSuccess: boolean
  isDocumentSigning: boolean
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
      pdfPath: '',
      updateCharterStatusResponse: null,
      uploadCharterSignatureResponse: null,
      signatureId: '',
      signedDocumentsArray: [],
      isCharterUpdateLoading: false,
      isCharterUpdateSuccess: false,
      isDocumentSigning: false,
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
          console.log('SIGNED_PDF_UPLOAD_RESPONSE', response)
          return response
        } catch (e) {
          console.error('SIGNED_PDF_UPLOAD_ERROR', e)
          return 'FAILURE'
        }
      },
      linkSignPDFToCharter: async (path, description, charterID) => {
        try {
          const response = await API.linkSignPDFToCharter(
            path,
            description,
            charterID
          )
          console.log('LINK_SIGNED_DOCUMENT_TO_CHARTER', response)
          return 'SUCCESS'
        } catch (e) {
          console.error('LINKING_SINGED_DOCUMENT_TO_CHARTER_ERROR', e)
          return 'FAILURE'
        }
      }
    }),
    {
      name: 'charters-storage',
      getStorage: () => AsyncStorage,
    }
  )
)
