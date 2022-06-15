import create from 'zustand'
import {persist} from 'zustand/middleware'
import AsyncStorage from '@react-native-async-storage/async-storage'
import * as API from '@bluecentury/api/vemasys'

type MapState = {
  prevNavLogs: [] | undefined
  plannedNavLogs: [] | undefined
  currentNavLogs: [] | undefined
  lastCompleteNavLogs: [] | {}
  isLoadingMap: boolean
}

type MapActions = {
  getPreviousNavigationLogs: (vesselId: string) => void
  getPlannedNavigationLogs: (vesselId: string) => void
  getCurrentNavigationLogs: (vesselId: string) => void
  getLastCompleteNavigationLogs: (navLogId: string) => void
}

type MapStore = MapState & MapActions

export const useMap = create(
  persist<MapStore>(
    set => ({
      prevNavLogs: [],
      plannedNavLogs: [],
      currentNavLogs: [],
      lastCompleteNavLogs: [],
      isLoadingMap: false,
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
      }
    }),

    {
      name: 'map-storage',
      getStorage: () => AsyncStorage
    }
  )
)
