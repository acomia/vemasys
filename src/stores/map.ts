import create from 'zustand'
import {persist} from 'zustand/middleware'
import AsyncStorage from '@react-native-async-storage/async-storage'
import {GeoPosition} from 'react-native-geolocation-service'

import * as API from '@bluecentury/api/vemasys'

type MapState = {
  isLoadingMap: boolean
  prevNavLogs: [] | undefined
  plannedNavLogs: [] | undefined
  currentNavLogs: [] | undefined
  lastCompleteNavLogs: [] | undefined
  activeFormations: [] | undefined
  tokenHasConnectedToShip: boolean
  isMobileTrackingEnable: boolean
}

type MapActions = {
  getPreviousNavigationLogs: (vesselId: string) => void
  getPlannedNavigationLogs: (vesselId: string) => void
  getCurrentNavigationLogs: (vesselId: string) => void
  getLastCompleteNavigationLogs: (navLogId: string) => void
  getActiveFormations: () => void
  verifyTrackingDeviceToken: (id: string, token: string, method: string) => void
  endVesselFormations: (formationId: string, vesselId: string) => void
  removeVesselFromFormations: (formationId: string, vesselId: string) => void
  sendCurrentPosition: (position: GeoPosition) => void
  enableMobileTracking: () => void
}

type MapStore = MapState & MapActions

export const useMap = create(
  persist<MapStore>(
    (set, get) => ({
      isLoadingMap: false,
      prevNavLogs: [],
      plannedNavLogs: [],
      currentNavLogs: [],
      lastCompleteNavLogs: [],
      activeFormations: [],
      tokenHasConnectedToShip: false,
      isMobileTrackingEnable: false,
      getPreviousNavigationLogs: async (vesselId: string) => {
        set({
          isLoadingMap: true
        })
        try {
          const response: any = await API.getPreviousNavLog(vesselId)
          if (Array.isArray(response)) {
            set({
              isLoadingMap: false,
              prevNavLogs: response
            })
          } else {
            set({
              isLoadingMap: false,
              prevNavLogs: []
            })
          }
        } catch (error) {
          set({
            isLoadingMap: false
          })
        }
      },
      getPlannedNavigationLogs: async (vesselId: string) => {
        set({
          isLoadingMap: true
        })
        try {
          const response: any = await API.getPlannedNavLog(vesselId)
          if (Array.isArray(response)) {
            set({
              isLoadingMap: false,
              plannedNavLogs: response
            })
          } else {
            set({
              isLoadingMap: false,
              plannedNavLogs: []
            })
          }
        } catch (error) {
          set({
            isLoadingMap: false
          })
        }
      },
      getCurrentNavigationLogs: async (vesselId: string) => {
        set({
          isLoadingMap: true
        })
        try {
          const response: any = await API.getCurrentNavLog(vesselId)
          if (Array.isArray(response)) {
            set({
              isLoadingMap: false,
              currentNavLogs: response
            })
          } else {
            set({
              isLoadingMap: false,
              currentNavLogs: []
            })
          }
        } catch (error) {
          set({
            isLoadingMap: false
          })
        }
      },
      getLastCompleteNavigationLogs: async (navLogId: string) => {
        set({
          isLoadingMap: true
        })
        try {
          const response: any = await API.getLastCompleteNavLogs(navLogId)

          if (typeof response === 'object') {
            if (response.routes.length > 0) {
              set({
                isLoadingMap: false,
                lastCompleteNavLogs: response.routes
              })
            } else {
              set({
                isLoadingMap: false,
                lastCompleteNavLogs: []
              })
            }
          } else {
            set({
              isLoadingMap: false,
              lastCompleteNavLogs: []
            })
          }
        } catch (error) {
          set({
            isLoadingMap: false
          })
        }
      },
      getActiveFormations: async () => {
        try {
          const response: any = await API.getActiveFormations()
          console.log('formation', response)
          if (Array.isArray(response)) {
            set({
              activeFormations: response
            })
          } else {
            set({
              activeFormations: []
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
      sendCurrentPosition: async (position: GeoPosition) => {
        try {
          set({isLoadingMap: true})
          const response: any = await API.sendCurrentPosition(position)
          if (response) {
            set({isLoadingMap: false})
          }
        } catch (error) {
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
      }
    }),
    {
      name: 'map-storage',
      getStorage: () => AsyncStorage
    }
  )
)
