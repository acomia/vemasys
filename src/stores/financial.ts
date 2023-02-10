import create from 'zustand'
import {persist} from 'zustand/middleware'
import AsyncStorage from '@react-native-async-storage/async-storage'

import * as API from '@bluecentury/api/vemasys'

type FinancialState = {
  isFinancialLoading: boolean
  invoiceStatistics: [] | undefined
  incomingInvoices: any[] | undefined
  outgoingInvoices: any[] | undefined
  invoiceDetails: any[] | undefined
}

type FinancialActions = {
  getInvoiceStatistics: (year: string) => void
  getInvoices: (viewPoint: string, year: string, page: number) => void
  getInvoiceDetails: (id: string) => void
  updateInvoiceStatus: (
    id: string,
    in_status: string,
    out_status: string
  ) => void
  addFilesInGroup: (path: string) => void
  addFinancialScan: (path: string) => Promise<string>
}

type FinancialStore = FinancialActions & FinancialState

export const useFinancial = create(
  persist<FinancialStore>(
    (set, get) => ({
      isFinancialLoading: false,
      invoiceStatistics: [],
      incomingInvoices: [],
      outgoingInvoices: [],
      invoiceDetails: [],
      getInvoiceStatistics: async (year: string) => {
        set({
          isFinancialLoading: true,
          invoiceStatistics: [],
        })
        try {
          const response = await API.reloadInvoiceStatistics(year)
          if (typeof response === 'object') {
            set({
              isFinancialLoading: false,
              invoiceStatistics: response?.financialInformations,
            })
          } else {
            set({
              isFinancialLoading: false,
              invoiceStatistics: [],
            })
          }
        } catch (error) {
          set({
            isFinancialLoading: false,
          })
        }
      },
      getInvoices: async (viewPoint: string, year: string, page: number) => {
        set({
          isFinancialLoading: true,
        })
        try {
          const response = await API.reloadInvoices(viewPoint, year, page)
          if (Array.isArray(response)) {
            if (viewPoint === 'Incoming') {
              set({
                isFinancialLoading: false,
                incomingInvoices:
                  page === 1
                    ? response
                    : [...get().incomingInvoices, ...response],
              })
            } else {
              set({
                isFinancialLoading: false,
                outgoingInvoices:
                  page === 1
                    ? response
                    : [...get().outgoingInvoices, ...response],
              })
            }
          } else {
            set({
              isFinancialLoading: false,
              incomingInvoices: [],
            })
          }
        } catch (error) {
          set({
            isFinancialLoading: false,
          })
        }
      },
      getInvoiceDetails: async (id: string) => {
        set({
          isFinancialLoading: true,
          invoiceDetails: [],
        })
        try {
          const response = await API.getInvoiceDetails(id)
          if (typeof response === 'object') {
            set({
              isFinancialLoading: false,
              invoiceDetails: response,
            })
          } else {
            set({
              isFinancialLoading: false,
              invoiceDetails: [],
            })
          }
        } catch (error) {
          set({
            isFinancialLoading: false,
          })
        }
      },
      updateInvoiceStatus: async (
        id: string,
        in_status: string,
        out_status: string
      ) => {
        set({
          isFinancialLoading: true,
          invoiceDetails: [],
        })
        try {
          const response = await API.updateInvoiceStatus(
            id,
            in_status,
            out_status
          )

          if (typeof response === 'object') {
            set({
              isFinancialLoading: false,
            })
            return response
          } else {
            set({
              isFinancialLoading: false,
            })
            return {}
          }
        } catch (error) {
          set({
            isFinancialLoading: false,
          })
        }
      },
      addFilesInGroup: async (path: string) => {
        set({
          isFinancialLoading: true,
        })
        try {
          const response = await API.uploadFinancialFile(path)
          set({
            isFinancialLoading: false,
          })
          return response
        } catch (error) {
          set({
            isFinancialLoading: false,
          })
          console.log('FILE_ADDING_TO_GROUP_ERROR', error)
        }
      },
      addFinancialScan: async (path: string) => {
        set({
          isFinancialLoading: true,
        })
        try {
          const response = await API.addFinancialScan(path)
          set({
            isFinancialLoading: false,
          })
          return response
        } catch (error) {
          set({
            isFinancialLoading: false,
          })
          console.log('ADD_FINANCIAL_SCAN_ERROR', error)
          return 'ADD_FINANCIAL_SCAN_FAILED'
        }
      },
    }),
    {
      name: 'financial-storage',
      getStorage: () => AsyncStorage,
    }
  )
)
