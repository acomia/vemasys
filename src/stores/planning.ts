import create from 'zustand'
import {persist} from 'zustand/middleware'
import AsyncStorage from '@react-native-async-storage/async-storage'

import * as API from '@bluecentury/api/vemasys'

type PlanningState = {
  isPlanningLoading: boolean
  plannedNavigationLogs: [] | undefined
  historyNavigationLogs: any[]
  navigationLogDetails?: {} | undefined
  navigationLogActions?: any[]
  navigationLogCargoHolds?: any[]
  navigationLogComments?: any[]
  navigationLogDocuments?: any[]
}

type PlanningActions = {
  getVesselHistoryNavLogs?: (vesselId: string, page: number) => void
  getVesselPlannedNavLogs?: (vesselId: string) => void
  getNavigationLogDetails?: (navLogId: string) => void
  getNavigationLogActions?: (navLogId: string) => void
  getNavigationLogCargoHolds?: (physicalVesselId: string) => void
  getNavigationLogComments?: (navLogId: string) => void
  getNavigationLogDocuments?: (navLogId: string) => void
}

type PlanningStore = PlanningState & PlanningActions

export const usePlanning = create(
  persist<PlanningStore>(
    (set, get) => ({
      isPlanningLoading: false,
      plannedNavigationLogs: [],
      historyNavigationLogs: [],
      getVesselHistoryNavLogs: async (vesselId: string, page: number) => {
        set({
          isPlanningLoading: true,
          historyNavigationLogs: page === 1 ? [] : get().historyNavigationLogs
        })
        try {
          const response = await API.reloadVesselHistoryNavLogs(vesselId, page)
          if (Array.isArray(response)) {
            set({
              historyNavigationLogs:
                page === 1
                  ? response
                  : [...get().historyNavigationLogs, ...response],
              isPlanningLoading: false
            })
          } else {
            set({
              isPlanningLoading: false,
              historyNavigationLogs: []
            })
          }
        } catch (error) {
          set({
            isPlanningLoading: false
          })
        }
      },
      getVesselPlannedNavLogs: async (vesselId: string) => {
        set({
          isPlanningLoading: true,
          plannedNavigationLogs: []
        })
        try {
          const response = await API.getPlannedNavLog(vesselId)
          if (Array.isArray(response)) {
            set({
              isPlanningLoading: false,
              plannedNavigationLogs: response
            })
          } else {
            set({
              isPlanningLoading: false,
              plannedNavigationLogs: []
            })
          }
        } catch (error) {
          set({
            isPlanningLoading: false
          })
        }
      },
      getNavigationLogDetails: async (navLogId: string) => {
        set({
          isPlanningLoading: true,
          navigationLogDetails: {}
        })
        try {
          const response = await API.reloadNavigationLogDetails(navLogId)
          console.log('details navlog', response)

          if (typeof response === 'object') {
            set({
              isPlanningLoading: false,
              navigationLogDetails: response
            })
          } else {
            set({
              isPlanningLoading: false,
              navigationLogDetails: {}
            })
          }
        } catch (error) {
          set({
            isPlanningLoading: false
          })
        }
      },
      getNavigationLogActions: async (navLogId: string) => {
        set({
          isPlanningLoading: true,
          navigationLogActions: []
        })
        try {
          const response = await API.reloadNavigationLogActions(navLogId)
          if (Array.isArray(response)) {
            set({
              isPlanningLoading: false,
              navigationLogActions: response
            })
          } else {
            set({
              isPlanningLoading: false,
              navigationLogActions: []
            })
          }
        } catch (error) {
          set({
            isPlanningLoading: false
          })
        }
      },
      getNavigationLogCargoHolds: async (physicalVesselId: string) => {
        set({
          isPlanningLoading: true,
          navigationLogCargoHolds: []
        })
        try {
          const response = await API.reloadNavigationLogCargoHolds(
            physicalVesselId
          )
          if (Array.isArray(response)) {
            set({
              isPlanningLoading: false,
              navigationLogCargoHolds: response
            })
          } else {
            set({
              isPlanningLoading: false,
              navigationLogCargoHolds: []
            })
          }
        } catch (error) {
          set({
            isPlanningLoading: false
          })
        }
      },
      getNavigationLogComments: async (navLogId: string) => {
        set({
          isPlanningLoading: true,
          navigationLogComments: []
        })
        try {
          const response = await API.reloadNavigationLogComments(navLogId)
          if (Array.isArray(response)) {
            set({
              isPlanningLoading: false,
              navigationLogComments: response
            })
          } else {
            set({
              isPlanningLoading: false,
              navigationLogComments: []
            })
          }
        } catch (error) {
          set({
            isPlanningLoading: false
          })
        }
      },
      getNavigationLogDocuments: async (navLogId: string) => {
        set({
          isPlanningLoading: true,
          navigationLogDocuments: []
        })
        try {
          const response = await API.reloadNavigationLogDocuments(navLogId)
          if (Array.isArray(response)) {
            set({
              isPlanningLoading: false,
              navigationLogDocuments: response
            })
          } else {
            set({
              isPlanningLoading: false,
              navigationLogDocuments: []
            })
          }
        } catch (error) {
          set({
            isPlanningLoading: false
          })
        }
      }
    }),
    {
      name: 'planning-storage',
      getStorage: () => AsyncStorage
    }
  )
)
