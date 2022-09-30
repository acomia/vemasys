import create from 'zustand'
import {persist} from 'zustand/middleware'
import AsyncStorage from '@react-native-async-storage/async-storage'
import * as API from '@bluecentury/api/vemasys'
import {Location} from '@mauron85/react-native-background-geolocation'
import {getVesselStatus} from '@bluecentury/api/vemasys'

type MapState = {
  vesselStatus: any
  prevNavLogs: Array<any>
  plannedNavLogs: Array<any>
  currentNavLogs: Array<any>
  lastCompleteNavLogs: Array<any>
  activeFormations: Array<any>
  isLoadingMap: boolean
  isLoadingVesselStatus: boolean
  isLoadingPreviousNavLogs: boolean
  isLoadingCurrentNavLogs: boolean
  isLoadingPlannedNavLogs: boolean
  hasErrorLoadingPreviousNavLogs: boolean
  hasErrorLoadingCurrentNavLogs: boolean
  hasErrorLoadingPlannedNavLogs: boolean
  tokenHasConnectedToShip: boolean
  isMobileTrackingEnable: boolean
  hasErrorLoadingNavigationLogs: boolean
  hasErrorLoadingVesselStatus: boolean
}

type MapActions = {
  getVesselStatus: (vesselId: string) => Promise<void>
  getPreviousNavigationLogs: (vesselId: string) => Promise<void>
  getPlannedNavigationLogs: (vesselId: string) => Promise<void>
  getCurrentNavigationLogs: (vesselId: string) => Promise<void>
  getLastCompleteNavigationLogs: (navLogId: string) => Promise<void>
  getActiveFormations: () => void
  verifyTrackingDeviceToken: (id: string, token: string, method: string) => void
  endVesselFormations: (formationId: string, vesselId: string) => void
  removeVesselFromFormations: (formationId: string, vesselId: string) => void
  sendCurrentPosition: (entityId: string, position: Location) => void
  enableMobileTracking: () => void
  reset: () => void
}

type MapStore = MapState & MapActions

const initialMapState: MapState = {
  vesselStatus: undefined,
  prevNavLogs: [],
  plannedNavLogs: [],
  currentNavLogs: [],
  lastCompleteNavLogs: [],
  activeFormations: [],
  isLoadingMap: false,
  isLoadingVesselStatus: false,
  isLoadingCurrentNavLogs: false,
  isLoadingPlannedNavLogs: false,
  isLoadingPreviousNavLogs: false,
  tokenHasConnectedToShip: false,
  isMobileTrackingEnable: false,
  hasErrorLoadingCurrentNavLogs: false,
  hasErrorLoadingPlannedNavLogs: false,
  hasErrorLoadingPreviousNavLogs: false,
  hasErrorLoadingNavigationLogs: false,
  hasErrorLoadingVesselStatus: false,
}

export const useMap = create(
  persist<MapStore>(
    (set, get) => ({
      ...initialMapState,
      getPreviousNavigationLogs: async (vesselId: string) => {
        set({
          isLoadingPreviousNavLogs: true,
          hasErrorLoadingPreviousNavLogs: false,
        })
        try {
          const response: any = await API.getPreviousNavLog(vesselId)
          if (Array.isArray(response)) {
            set({
              prevNavLogs: response,
            })
          } else {
            set({
              prevNavLogs: [],
            })
          }
          set({
            isLoadingPreviousNavLogs: false,
          })
        } catch (error) {
          set({
            isLoadingPreviousNavLogs: false,
            hasErrorLoadingPreviousNavLogs: true,
          })
        }
      },
      getPlannedNavigationLogs: async (vesselId: string) => {
        set({
          isLoadingPlannedNavLogs: true,
          hasErrorLoadingPlannedNavLogs: false,
        })
        try {
          const response: any = await API.getPlannedNavLog(vesselId)
          if (Array.isArray(response)) {
            set({
              plannedNavLogs: response,
            })
          } else {
            set({
              plannedNavLogs: [],
            })
          }
          set({
            isLoadingPlannedNavLogs: false,
          })
        } catch (error) {
          set({
            isLoadingPlannedNavLogs: false,
            hasErrorLoadingPlannedNavLogs: true,
          })
        }
      },
      getCurrentNavigationLogs: async (vesselId: string) => {
        set({
          isLoadingCurrentNavLogs: true,
          hasErrorLoadingCurrentNavLogs: false,
        })
        try {
          const response: any = await API.getCurrentNavLog(vesselId)
          if (Array.isArray(response)) {
            set({
              currentNavLogs: response,
            })
          } else {
            set({
              currentNavLogs: [],
            })
          }
          set({
            isLoadingCurrentNavLogs: false,
          })
        } catch (error) {
          set({
            isLoadingCurrentNavLogs: false,
            hasErrorLoadingCurrentNavLogs: true,
          })
        }
      },
      getLastCompleteNavigationLogs: async (vesselId: string) => {
        set({
          isLoadingMap: true,
        })
        try {
          const response: any = await API.getLastCompleteNavLogs(vesselId)
          if (Array.isArray(response)) {
            let logs = response.reduce((prev, curr) => {
              if (prev.length === 0) return [...prev, curr]

              if (
                prev.findIndex(
                  value => value.location.name === curr.location.name
                ) !== -1
              ) {
                return [...prev]
              }

              return [...prev, curr]
            }, [])
            set({
              isLoadingMap: false,
              lastCompleteNavLogs: logs,
            })
          } else {
            set({
              isLoadingMap: false,
              lastCompleteNavLogs: [],
            })
          }
        } catch (error) {
          set({
            isLoadingMap: false,
          })
        }
      },
      getActiveFormations: async () => {
        try {
          const response = await API.getActiveFormations()
          if (Array.isArray(response)) {
            set({
              activeFormations: response,
            })
          } else {
            set({
              activeFormations: [],
            })
          }
        } catch (error) {}
      },
      verifyTrackingDeviceToken: async (
        id: string,
        token: string,
        method: string
      ) => {
        set({isLoadingMap: true})
        try {
          const response: any = await API.verifyTrackingDeviceToken(
            id,
            token,
            method
          )
          if (response[0].entity == null) {
            set({isLoadingMap: false, tokenHasConnectedToShip: false})
          } else {
            set({tokenHasConnectedToShip: true})
            if (method === 'create') {
              const response = await API.createVesselFormations(id, token)
              if (response) {
                set({isLoadingMap: false})
              }
            } else {
              const response = await API.addVesselToFormations(id, token)
              if (response) {
                set({isLoadingMap: false})
              }
            }
          }
        } catch (error) {
          set({isLoadingMap: false})
        }
      },
      sendCurrentPosition: async (entityId, position) => {
        try {
          set({isLoadingMap: true})
          const response: any = await API.sendCurrentPosition(
            entityId,
            position
          )
          console.log('response ', response)
          if (response) {
            set({isLoadingMap: false})
          }
        } catch (error) {
          console.log('error ', error)
          set({isLoadingMap: false})
        }
      },
      endVesselFormations: async (formationId: string, vesselId: string) => {
        try {
          const response = await API.endVesselFormations(formationId, vesselId)
          console.log('end', response)
          set({isLoadingMap: false})
        } catch (error) {
          set({isLoadingMap: false})
        }
      },
      removeVesselFromFormations: async (
        formationId: string,
        vesselId: string
      ) => {
        try {
          const response = await API.removeVesselToFormations(
            formationId,
            vesselId
          )
          console.log('remove', response)
          set({isLoadingMap: false})
        } catch (error) {
          set({isLoadingMap: false})
        }
      },
      enableMobileTracking: () => {
        const isMobileTrackingEnable = get().isMobileTrackingEnable
        set({isMobileTrackingEnable: !isMobileTrackingEnable})
      },
      getVesselStatus: async (vesselId: string) => {
        set({
          isLoadingVesselStatus: true,
          hasErrorLoadingVesselStatus: false,
        })
        try {
          const response: any = await API.getVesselStatus(vesselId)
          if (Array.isArray(response)) {
            set({
              vesselStatus: response[0],
            })
          } else {
            set({
              vesselStatus: undefined,
            })
          }
          set({
            isLoadingVesselStatus: false,
          })
        } catch (error) {
          set({
            isLoadingVesselStatus: false,
            hasErrorLoadingVesselStatus: true,
          })
        }
      },
      reset: () => {
        set({
          ...initialMapState,
        })
      },
    }),
    {
      name: 'map-storage',
      getStorage: () => AsyncStorage,
    }
  )
)
