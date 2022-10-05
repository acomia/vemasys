import create from 'zustand'
import {persist} from 'zustand/middleware'
import AsyncStorage from '@react-native-async-storage/async-storage'

import * as API from '@bluecentury/api/vemasys'

type InformationState = {
  isInformationLoading: boolean
  pegels: [] | undefined
  pegelDetails: [] | undefined
  streamGauges: [] | undefined
  rules: any[] | undefined
  tickerOilPrices: any[] | undefined
}

type InformationActions = {
  getVesselPegels?: (name: string) => void
  getVesselRules?: (vesselId: string, name: string) => void
  getVesselTickerOilPrices?: () => void
  getPegelDetails?: (pegelId: number) => void
}

type InformationStore = InformationActions & InformationState

export const useInformation = create(
  persist<InformationStore>(
    (set, get) => ({
      isInformationLoading: false,
      pegels: [],
      pegelDetails: [],
      streamGauges: [],
      rules: [],
      tickerOilPrices: [],
      getVesselPegels: async (name: string) => {
        set({
          isInformationLoading: true,
          pegels: [],
          streamGauges: []
        })
        try {
          const response = await API.reloadVesselPegels(name)
          if (Array.isArray(response)) {
            let streamGaugeReferences: any[] = []
            response.forEach(river => {
              streamGaugeReferences = [
                ...streamGaugeReferences,
                ...river.streamGauges.filter(
                  (sg: {isStreamGaugeReference: any}) =>
                    sg.isStreamGaugeReference
                )
              ]
            })
            streamGaugeReferences?.sort((a: any, b: any) =>
              `${a.name}`.localeCompare(b.name)
            )
            set({
              isInformationLoading: false,
              pegels: response,
              streamGauges: streamGaugeReferences
            })
          } else {
            set({
              isInformationLoading: false
            })
          }
        } catch (error) {
          set({
            isInformationLoading: false
          })
        }
      },
      getVesselRules: async (vesselId: string, name: string) => {
        set({
          isInformationLoading: true,
          rules: []
        })
        try {
          const response = await API.reloadVesselRules(vesselId, name)
          if (Array.isArray(response)) {
            set({
              isInformationLoading: false,
              rules: response
            })
          } else {
            set({
              isInformationLoading: false
            })
          }
        } catch (error) {
          set({
            isInformationLoading: false
          })
        }
      },
      getVesselTickerOilPrices: async () => {
        set({
          isInformationLoading: true,
          tickerOilPrices: []
        })
        try {
          const response = await API.reloadVesselTickerOilPrices()
          if (Array.isArray(response)) {
            set({
              isInformationLoading: false,
              tickerOilPrices: response
            })
          } else {
            set({
              isInformationLoading: false,
              tickerOilPrices: []
            })
          }
        } catch (error) {
          set({
            isInformationLoading: false
          })
        }
      },
      getPegelDetails: async (pegelId: number) => {
        set({
          isInformationLoading: true,
          pegelDetails: []
        })
        try {
          const response = await API.reloadPegelDetails(pegelId)
          if (Array.isArray(response)) {
            set({
              isInformationLoading: false,
              pegelDetails: response
            })
          } else {
            set({
              isInformationLoading: false,
              pegelDetails: []
            })
          }
        } catch (error) {
          set({
            isInformationLoading: false
          })
        }
      }
    }),
    {
      name: 'information-storage',
      getStorage: () => AsyncStorage
    }
  )
)
