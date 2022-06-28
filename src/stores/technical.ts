import create from 'zustand'
import {persist} from 'zustand/middleware'
import AsyncStorage from '@react-native-async-storage/async-storage'

import * as API from '@bluecentury/api/vemasys'

type TechnicalState = {
  isTechnicalLoading: boolean
  bunkering: [] | undefined
  gasoilReserviors: [] | undefined
}

type TechnicalActions = {
  getVesselBunkering: (vesselId: string) => void
  getVesselGasoilReservoirs: (physicalVesselId: string) => void
}

type TechnicalStore = TechnicalState & TechnicalActions

export const useTechnical = create(
  persist<TechnicalStore>(
    (set, get) => ({
      isTechnicalLoading: false,
      bunkering: [],
      gasoilReserviors: [],
      getVesselBunkering: async (vesselId: string) => {
        set({isTechnicalLoading: true, bunkering: []})
        try {
          const response = await API.reloadVesselBunkering(vesselId)
          console.log('bunkering', response)
          if (Array.isArray(response)) {
            set({
              isTechnicalLoading: false,
              bunkering: response
            })
          } else {
            set({
              isTechnicalLoading: false,
              bunkering: []
            })
          }
        } catch (error) {
          set({isTechnicalLoading: false})
        }
      },
      getVesselGasoilReservoirs: async (physicalVesselId: string) => {
        set({isTechnicalLoading: true, gasoilReserviors: []})
        try {
          const response = await API.reloadVesselGasoilReservoirs(
            physicalVesselId
          )
          console.log('gasoil', response)
          if (Array.isArray(response)) {
            set({
              isTechnicalLoading: false,
              gasoilReserviors: response
            })
          } else {
            set({
              isTechnicalLoading: false,
              gasoilReserviors: []
            })
          }
        } catch (error) {
          set({isTechnicalLoading: false})
        }
      }
    }),
    {
      name: 'technical-storage',
      getStorage: () => AsyncStorage
    }
  )
)
