import create from 'zustand'
import {persist} from 'zustand/middleware'
import AsyncStorage from '@react-native-async-storage/async-storage'

import * as API from '@bluecentury/api/vemasys'

type TechnicalState = {
  isTechnicalLoading: boolean
  bunkering: [] | undefined
  gasoilReserviors: [] | undefined
  lastGasoilMeasurements: [] | undefined
  bunkeringSuppliers?: [] | undefined
  engines: [] | undefined
  lastMeasurements?: [] | undefined
}

type TechnicalActions = {
  getVesselBunkering: (vesselId: string) => void
  getVesselGasoilReservoirs: (physicalVesselId: string) => void
  getVesselBunkeringSuppliers: () => void
  createVesselBunkering?: (bunkering: any) => void
  getVesselEngines: (physicalVesselId: string) => void
}

type TechnicalStore = TechnicalState & TechnicalActions

export const useTechnical = create(
  persist<TechnicalStore>(
    (set, get) => ({
      isTechnicalLoading: false,
      bunkering: [],
      gasoilReserviors: [],
      lastGasoilMeasurements: [],
      engines: [],
      getVesselBunkering: async (vesselId: string) => {
        set({isTechnicalLoading: true, bunkering: []})
        try {
          const response = await API.reloadVesselBunkering(vesselId)
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
          if (response && response.length > 0) {
            const gasoilR = response
              .filter(
                (gasoil: {type: {title: string}}) =>
                  gasoil.type.title === 'Fuel'
              )
              .filter(
                (reservoir: {vesselZone: {physicalVessel: {id: any}}}) =>
                  reservoir?.vesselZone?.physicalVessel?.id === physicalVesselId
              )
            set({lastGasoilMeasurements: []})
            gasoilR.forEach(async reservoir => {
              set({isTechnicalLoading: true})
              const lastM = await API.reloadVesselPartLastMeasurements(
                reservoir.id
              )
              let lastGasoilM = get().lastGasoilMeasurements
              lastGasoilM?.push(lastM[0])
              set({lastGasoilMeasurements: lastGasoilM})
            })
          }
          if (Array.isArray(response)) {
            const gasoilR = response
              .filter(
                (gasoil: {type: {title: string}}) =>
                  gasoil.type.title === 'Fuel'
              )
              .filter(
                (reservoir: {vesselZone: {physicalVessel: {id: any}}}) =>
                  reservoir?.vesselZone?.physicalVessel?.id === physicalVesselId
              )
            set({
              isTechnicalLoading: false,
              gasoilReserviors: gasoilR
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
      },
      getVesselBunkeringSuppliers: async () => {
        set({isTechnicalLoading: true, bunkeringSuppliers: []})
        try {
          const response = await API.reloadVesselBunkeringSuppliers()

          if (Array.isArray(response)) {
            set({
              isTechnicalLoading: false,
              bunkeringSuppliers: response
            })
          } else {
            set({
              isTechnicalLoading: false,
              bunkeringSuppliers: []
            })
          }
        } catch (error) {
          set({isTechnicalLoading: false})
        }
      },
      createVesselBunkering: async (bunkering: any) => {
        set({isTechnicalLoading: true})
        try {
          const response = await API.createVesselBunkering(bunkering)
          return [response]
        } catch (error) {
          set({isTechnicalLoading: false})
        }
      },
      getVesselEngines: async (physicalVesselId: string) => {
        set({isTechnicalLoading: true, engines: []})
        try {
          const response = await API.reloadVesselEngines(physicalVesselId)
          if (Array.isArray(response)) {
            set({
              isTechnicalLoading: false,
              engines: response
            })
          } else {
            set({
              isTechnicalLoading: false,
              engines: []
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
