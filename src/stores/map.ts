import create from 'zustand'
import {persist} from 'zustand/middleware'
import AsyncStorage from '@react-native-async-storage/async-storage'
import * as API from '@bluecentury/api/vemasys'

type MapState = {
  prevNavLogs: [] | undefined
  plannedNavLogs: [] | undefined
  currentNavLogs: [] | undefined
  isLoadingMap: boolean
}

type MapActions = {
  getPreviousNavigationLogs: (vesselId: string) => void
  // getPlannedNavigationLogs: (vesselId: string) => void
  // getCurrentNavigationLogs: (vesselId: string) => void
}

type MapStore = MapState & MapActions

export const useMap = create(
  persist<MapStore>(
    set => ({
      prevNavLogs: [],
      plannedNavLogs: [],
      currentNavLogs: [],
      isLoadingMap: false,
      getPreviousNavigationLogs: async (vesselId: string) => {
        set({
          isLoadingMap: true
        })
        try {
          const response = await API.getPreviousNavLog(vesselId)
          console.log('prevnavlog', response)

          set({
            isLoadingMap: false,
            prevNavLogs: response
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
