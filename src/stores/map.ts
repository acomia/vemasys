import create from 'zustand'
import {persist} from 'zustand/middleware'
import AsyncStorage from '@react-native-async-storage/async-storage'
import {GeoPosition} from 'react-native-geolocation-service'

import * as API from '@bluecentury/api/vemasys'

type MapState = {
  isLoadingMap: boolean
  prevNavLogs: [] | {} | undefined
  plannedNavLogs: [] | {} | undefined
  currentNavLogs: [] | {} | undefined
  lastCompleteNavLogs: [] | {} | undefined
  activeFormations: [] | {} | undefined
}

type MapActions = {
  getPreviousNavigationLogs: (vesselId: string) => void
  getPlannedNavigationLogs: (vesselId: string) => void
  getCurrentNavigationLogs: (vesselId: string) => void
  getLastCompleteNavigationLogs: (navLogId: string) => void
  getActiveFormations: () => void
  verifyTrackingDeviceToken: (id: string, token: string, method: string) => void
  sendCurrentPosition: (position: GeoPosition) => void
}

type MapStore = MapState & MapActions

export const useMap = create(
  persist<MapStore>(
    set => ({
      isLoadingMap: false,
      prevNavLogs: [],
      plannedNavLogs: [],
      currentNavLogs: [],
      lastCompleteNavLogs: [],
      activeFormations: [],
      getPreviousNavigationLogs: async (vesselId: string) => {
        set({
          isLoadingMap: true
        })
        try {
          const response: any = await API.getPreviousNavLog(vesselId)
          set({
            isLoadingMap: false,
            prevNavLogs: response
          })
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
          set({
            isLoadingMap: false,
            plannedNavLogs: response
          })
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
          set({
            isLoadingMap: false,
            currentNavLogs: response
          })
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
          console.log('last', response)
          set({
            isLoadingMap: false,
            lastCompleteNavLogs: response
          })
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
          set({
            activeFormations: response
          })
        } catch (error) {}
      },
      verifyTrackingDeviceToken: async (
        id: string,
        token: string,
        method: string
      ) => {
        // set({isLoadingMap: true})
        try {
          const response: any = await API.verifyTrackingDeviceToken(
            id,
            token,
            method
          )
          console.log('verify', response[0].entity)
          if (response) {
            set({isLoadingMap: false})
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
      }
    }),
    {
      name: 'map-storage',
      getStorage: () => AsyncStorage
    }
  )
)
