import create from 'zustand'
import {persist} from 'zustand/middleware'
import AsyncStorage from '@react-native-async-storage/async-storage'
import * as API from '@bluecentury/api/vemasys'
import {
  NavigationLog,
  NavigationLogRoutes,
  TonnageCertifications,
  Vessel,
  Comments,
} from '@bluecentury/models'

type PlanningState = {
  isPlanningLoading: boolean
  isPlanningDetailsLoading: boolean
  isPlanningActionsLoading: boolean
  isPlanningCommentsLoading: boolean
  isPlanningDocumentsLoading: boolean
  isPlanningRoutesLoading: boolean
  plannedNavigationLogs: NavigationLog[] | undefined
  historyNavigationLogs: any[]
  navigationLogDetails: NavigationLog | undefined
  navigationLogActions: any[] | undefined
  navigationLogCargoHolds: any[]
  navigationLogComments: Array<Comments>
  navigationLogDocuments: any[]
  navigationLogRoutes: NavigationLogRoutes[] | undefined
  bulkTypes?: []
  hasErrorLoadingPlannedNavigationLogs: boolean
  hasErrorLoadingVesselHistoryNavLogs: boolean
  isCreateNavLogActionSuccess: boolean
  isUpdateNavLogActionSuccess: boolean
  isDeleteNavLogActionSuccess: boolean
  updateNavlogDatesSuccess: string
  updateNavlogDatesFailed: string
  updateNavlogDatesMessage: string
  isVesselNavigationLoading: boolean
  vesselNavigationDetails: Vessel | undefined
  isSavingNavBulkLoading: boolean
  isSavingNavBulkSuccess: boolean
  isTonnageCertificationLoading: boolean
  tonnageCertifications: TonnageCertifications[] | undefined
  isUpdateBulkCargoLoading: boolean
}

type PlanningActions = {
  getVesselHistoryNavLogs: (vesselId: string, page: number) => void
  getVesselPlannedNavLogs: (vesselId: string) => void
  getNavigationLogDetails: (navLogId: string) => void
  getNavigationLogActions: (navLogId: string) => void
  getNavigationLogCargoHolds: (physicalVesselId: string) => void
  getNavigationLogComments: (navLogId: string) => void
  getNavigationLogDocuments: (navLogId: string) => void
  getNavigationLogRoutes: (navLogId: string) => void
  updateNavlogDates: (navLogId: string, dates: object) => void
  createNavlogComment: (
    navLogId: string,
    comment: string,
    userId: string,
    accessLevel: string
  ) => void
  getBulkTypes: (query: string) => void
  updateBulkCargo: (cargo: any) => void
  createBulkCargo: (cargo: any, navLogId: string) => void
  deleteBulkCargo: (id: string) => void
  updateComment: (id: string, description: string, accessLevel: string) => void
  uploadImgFile: (file: ImageFile) => any
  deleteComment: (id: string) => void
  uploadVesselNavigationLogFile: (navLogId: string, body: any) => void
  createNavigationLogAction: (
    navigationLogId: string,
    navigationLogActionDetails: NavigationLogAction
  ) => void
  updateNavigationLogAction?: (
    id: string,
    navigationLogId: string,
    navigationLogActionDetails: NavigationLogAction
  ) => void
  deleteNavLogAction?: (id: string) => void
  reset?: () => void
  getVesselnavigationDetails: (id: string) => void
  getNavLogTonnageCertification: (id: number) => void
}

export type PlanningStore = PlanningState & PlanningActions

const initialState: PlanningState = {
  isPlanningLoading: false,
  isPlanningDetailsLoading: false,
  isPlanningActionsLoading: false,
  isPlanningCommentsLoading: false,
  isPlanningDocumentsLoading: false,
  plannedNavigationLogs: undefined,
  historyNavigationLogs: [],
  hasErrorLoadingPlannedNavigationLogs: false,
  hasErrorLoadingVesselHistoryNavLogs: false,
  isCreateNavLogActionSuccess: false,
  isUpdateNavLogActionSuccess: false,
  isDeleteNavLogActionSuccess: false,
  updateNavlogDatesSuccess: '',
  updateNavlogDatesFailed: '',
  updateNavlogDatesMessage: '',
  navigationLogDetails: undefined,
  navigationLogActions: undefined,
  navigationLogCargoHolds: [],
  navigationLogComments: [],
  navigationLogDocuments: [],
  isVesselNavigationLoading: false,
  vesselNavigationDetails: undefined,
  isSavingNavBulkLoading: false,
  isSavingNavBulkSuccess: false,
  isTonnageCertificationLoading: false,
  tonnageCertifications: [],
  isUpdateBulkCargoLoading: false,
}

export const usePlanning = create(
  persist<PlanningStore>(
    (set, get) => ({
      ...initialState,
      getVesselHistoryNavLogs: async (vesselId: string, page: number) => {
        set({
          isPlanningLoading: true,
          historyNavigationLogs: page === 1 ? [] : get().historyNavigationLogs,
          hasErrorLoadingVesselHistoryNavLogs: false,
        })
        try {
          const response = await API.reloadVesselHistoryNavLogs(vesselId, page)
          if (Array.isArray(response)) {
            set({
              historyNavigationLogs:
                page === 1
                  ? response
                  : [...get().historyNavigationLogs, ...response],
              isPlanningLoading: false,
            })
          } else {
            set({
              isPlanningLoading: false,
              historyNavigationLogs: [],
            })
          }
        } catch (error) {
          set({
            isPlanningLoading: false,
            hasErrorLoadingVesselHistoryNavLogs: true,
          })
        }
      },
      getVesselPlannedNavLogs: async (vesselId: string) => {
        set({
          isPlanningLoading: true,
          plannedNavigationLogs: undefined,
          hasErrorLoadingPlannedNavigationLogs: false,
        })
        try {
          const response = await API.getPlannedNavLog(vesselId)
          if (Array.isArray(response) && response.length > 0) {
            response.forEach(async (plan, index) => {
              const act = await API.reloadNavigationLogActions(plan.id)
              if (act?.length > 0) {
                plan.endActionDate = act[0]?.end
                plan.actionType = act[0]?.type
              } else {
                plan.endActionDate = undefined
                plan.actionType = ''
              }
            })
            set({
              plannedNavigationLogs: response,
              isPlanningLoading: false,
            })
          } else {
            set({
              isPlanningLoading: false,
              plannedNavigationLogs: [],
            })
          }
        } catch (error) {
          set({
            isPlanningLoading: false,
            hasErrorLoadingPlannedNavigationLogs: true,
          })
        }
      },
      getNavigationLogDetails: async (navLogId: string) => {
        set({
          isPlanningDetailsLoading: true,
          navigationLogDetails: undefined,
        })
        try {
          const response = await API.reloadNavigationLogDetails(navLogId)
          if (typeof response === 'object') {
            set({
              isPlanningDetailsLoading: false,
              navigationLogDetails: response,
            })
          } else {
            set({
              isPlanningDetailsLoading: false,
              navigationLogDetails: undefined,
            })
          }
        } catch (error) {
          set({
            isPlanningDetailsLoading: false,
          })
        }
      },
      getNavigationLogActions: async (navLogId: string) => {
        set({
          navigationLogActions: [],
          isPlanningActionsLoading: true,
        })
        try {
          const response = await API.reloadNavigationLogActions(navLogId)
          if (Array.isArray(response)) {
            set({
              navigationLogActions: response,
              isPlanningActionsLoading: false,
            })
          } else {
            set({
              navigationLogActions: [],
              isPlanningActionsLoading: false,
            })
          }
        } catch (error) {
          set({
            isPlanningActionsLoading: false,
          })
        }
      },
      getNavigationLogCargoHolds: async (physicalVesselId: string) => {
        set({
          isPlanningLoading: true,
          navigationLogCargoHolds: [],
        })
        try {
          const response = await API.reloadNavigationLogCargoHolds(
            physicalVesselId
          )
          if (Array.isArray(response)) {
            set({
              isPlanningLoading: false,
              navigationLogCargoHolds: response,
            })
          } else {
            set({
              isPlanningLoading: false,
              navigationLogCargoHolds: [],
            })
          }
        } catch (error) {
          set({
            isPlanningLoading: false,
          })
        }
      },
      getNavigationLogComments: async (navLogId: string) => {
        set({
          isPlanningCommentsLoading: true,
          navigationLogComments: [],
        })
        try {
          const response = await API.reloadNavigationLogComments(navLogId)
          if (Array.isArray(response)) {
            set({
              isPlanningCommentsLoading: false,
              navigationLogComments: response,
            })
          } else {
            set({
              isPlanningCommentsLoading: false,
              navigationLogComments: [],
            })
          }
        } catch (error) {
          set({
            isPlanningCommentsLoading: false,
          })
        }
      },
      getNavigationLogDocuments: async (navLogId: string) => {
        set({
          isPlanningDocumentsLoading: true,
          navigationLogDocuments: [],
        })
        try {
          const response = await API.reloadNavigationLogDocuments(navLogId)
          if (Array.isArray(response)) {
            set({
              isPlanningDocumentsLoading: false,
              navigationLogDocuments: response,
            })
          } else {
            set({
              isPlanningDocumentsLoading: false,
              navigationLogDocuments: [],
            })
          }
        } catch (error) {
          set({
            isPlanningDocumentsLoading: false,
          })
        }
      },
      getNavigationLogRoutes: async (navLogId: string) => {
        set({
          isPlanningRoutesLoading: true,
          navigationLogRoutes: [],
        })
        try {
          const response = await API.reloadNavigationLogRoutes(navLogId)
          if (response.routes.length) {
            set({
              isPlanningRoutesLoading: false,
              navigationLogRoutes: response.routes[0].waypoints,
            })
          } else {
            set({
              isPlanningRoutesLoading: false,
              navigationLogRoutes: [],
            })
          }
        } catch (error) {
          set({
            isPlanningRoutesLoading: false,
          })
        }
      },
      updateNavlogDates: async (navLogId: string, dates: object) => {
        set({isPlanningLoading: true})
        try {
          const response = await API.updateNavigationLogDatetimeFields(
            navLogId,
            dates
          )
          if (response === 'SUCCESS') {
            set({
              isPlanningLoading: false,
              updateNavlogDatesSuccess: response,
            })
          } else {
            set({
              isPlanningLoading: false,
              updateNavlogDatesFailed: 'FAILED',
              updateNavlogDatesMessage: response,
            })
          }
        } catch (error) {
          set({isPlanningLoading: false})
        }
      },
      createNavlogComment: async (
        navLogId: string,
        comment: string,
        userId: string,
        accessLevel: string
      ) => {
        set({isPlanningLoading: true})
        try {
          const response = await API.createNavlogComment(
            navLogId,
            comment,
            userId,
            accessLevel
          )
          set({isPlanningLoading: false})
          return response
        } catch (error) {
          set({isPlanningLoading: false})
        }
      },
      getBulkTypes: async (query: string) => {
        set({isPlanningLoading: true, bulkTypes: []})
        try {
          const response = await API.reloadBulkTypes(query)
          if (Array.isArray(response)) {
            set({isPlanningLoading: false, bulkTypes: response})
          } else {
            set({isPlanningLoading: false, bulkTypes: []})
          }
        } catch (error) {
          set({isPlanningLoading: false})
        }
      },
      updateBulkCargo: async (cargo: any) => {
        set({isPlanningLoading: true, isUpdateBulkCargoLoading: true})
        try {
          const response = await API.updateBulkCargoEntry(cargo)
          set({isPlanningLoading: false, isUpdateBulkCargoLoading: false})
          return response
        } catch (error) {
          set({isPlanningLoading: false, isUpdateBulkCargoLoading: false})
        }
      },
      createBulkCargo: async (cargo: any, navLogId: string) => {
        set({isPlanningLoading: true})
        try {
          const response = await API.createNewBulkCargoEntry(cargo, navLogId)
          set({isPlanningLoading: false})
          return response
        } catch (error) {
          set({isPlanningLoading: false})
        }
      },
      deleteBulkCargo: async (id: string) => {
        set({isPlanningLoading: true})
        try {
          const response = await API.deleteBulkCargoEntry(id)
          set({isPlanningLoading: false})
          return response
        } catch (error) {
          set({isPlanningLoading: false})
        }
      },
      updateComment: async (
        id: string,
        description: string,
        accessLevel: string
      ) => {
        set({isPlanningLoading: true})
        try {
          const response = await API.updateComment(id, description, accessLevel)
          set({isPlanningLoading: false})
          return response
        } catch (error) {
          set({isPlanningLoading: false})
        }
      },
      uploadImgFile: async (file: ImageFile) => {
        set({isPlanningLoading: true})
        try {
          const response = await API.uploadImgFile(file)
          set({isPlanningLoading: false})
          return response
        } catch (error) {
          set({isPlanningLoading: false})
        }
      },
      deleteComment: async (id: string) => {
        set({isPlanningLoading: true})
        try {
          const response = await API.deleteComment(id)
          set({isPlanningLoading: false})
          return response
        } catch (error) {
          set({isPlanningLoading: false})
        }
      },
      uploadVesselNavigationLogFile: async (navLogId: string, body: any) => {
        set({isPlanningLoading: true})
        try {
          const response = await API.uploadVesselNavigationLogFile(
            navLogId,
            body
          )
          set({isPlanningLoading: false})
          return response
        } catch (error) {
          set({isPlanningLoading: false})
        }
      },
      createNavigationLogAction: async (
        navigationLogId: string,
        navigationLogActionDetails: NavigationLogAction
      ) => {
        const {start, end, estimatedEnd, type, cargoHoldActions} =
          navigationLogActionDetails
        const body = {
          navigationLog: {
            id: navigationLogId,
          },
          type,
          start: start ? start : null,
          end: end ? end : null,
          estimatedEnd: estimatedEnd ? estimatedEnd : null,
          navigationBulk: {
            id: cargoHoldActions[0].navigationBulk,
            amount: cargoHoldActions[0].amount,
          },
        }
        set({isPlanningActionsLoading: true})
        try {
          const response = await API.createNavigationLogAction(body)
          if (typeof response === 'object' && response?.id) {
            set({isCreateNavLogActionSuccess: true})
          } else {
            set({
              isPlanningActionsLoading: false,
              isCreateNavLogActionSuccess: false,
            })
          }
        } catch (error) {
          set({isPlanningActionsLoading: false})
        }
      },
      updateNavigationLogAction: async (
        id: string,
        navigationLogId: string,
        navigationLogActionDetails: NavigationLogAction
      ) => {
        const {start, end, estimatedEnd, type, cargoHoldActions} =
          navigationLogActionDetails
        const body = {
          navigationLog: {
            id: navigationLogId,
          },
          type,
          start: start ? start : null,
          end: end ? end : null,
          estimatedEnd: estimatedEnd ? estimatedEnd : null,
          navigationBulk: cargoHoldActions
            ? {
                id: cargoHoldActions[0].navigationBulk,
                amount: cargoHoldActions[0].amount,
              }
            : {},
        }
        set({isPlanningActionsLoading: true})
        try {
          const response = await API.updateNavigationLogAction(id, body)
          if (typeof response === 'object' && response?.id) {
            set({isUpdateNavLogActionSuccess: true})
          } else {
            set({
              isPlanningActionsLoading: false,
              isUpdateNavLogActionSuccess: false,
            })
          }
        } catch (error) {
          set({isPlanningActionsLoading: false})
        }
      },
      deleteNavLogAction: async (id: string) => {
        set({isPlanningActionsLoading: true})
        try {
          const response = await API.deleteNavigationLogAction(id)
          if (response === 204) {
            set({isDeleteNavLogActionSuccess: true})
          } else {
            set({
              isPlanningActionsLoading: false,
              isDeleteNavLogActionSuccess: false,
            })
          }
        } catch (error) {
          set({isPlanningActionsLoading: false})
        }
      },
      reset: () => {
        set({
          isCreateNavLogActionSuccess: false,
          isUpdateNavLogActionSuccess: false,
          isDeleteNavLogActionSuccess: false,
          updateNavlogDatesSuccess: '',
          updateNavlogDatesFailed: '',
          updateNavlogDatesMessage: '',
        })
      },
      getVesselnavigationDetails: async (id: string) => {
        set({isVesselNavigationLoading: true})
        try {
          const response = await API.getVesselNavigationDetails(id)

          if (typeof response === 'object') {
            set({
              vesselNavigationDetails: response,
              isVesselNavigationLoading: false,
            })
            return
          }

          set({isVesselNavigationLoading: false})
        } catch (error) {
          set({isVesselNavigationLoading: false})
        }
      },
      getNavLogTonnageCertification: async (id: number) => {
        set({
          isTonnageCertificationLoading: true,
          // added these two to make sure the saving will go back to its original
          // if not it will cause the scroll infinite loading
          isSavingNavBulkLoading: false,
          isSavingNavBulkSuccess: false,
          tonnageCertifications: [],
        })
        try {
          const response = await API.getTonnageCertification(id.toString())
          if (Object.values(response).length > 0) {
            set({
              isTonnageCertificationLoading: false,
              tonnageCertifications: response,
            })
          }
        } catch (error) {
          set({isTonnageCertificationLoading: false})
        }
      },
    }),
    {
      name: 'planning-storage',
      getStorage: () => AsyncStorage,
    }
  )
)
