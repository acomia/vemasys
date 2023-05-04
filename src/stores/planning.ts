import create from 'zustand'
import {persist} from 'zustand/middleware'
import AsyncStorage from '@react-native-async-storage/async-storage'
import * as API from '@bluecentury/api/vemasys'
import {
  NavigationLog,
  NavigationLogRoutes,
  TonnageCertifications,
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
  navigationLogComments: any[]
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
  isTonnageCertificateLoading: boolean
  tonnageCertificates: TonnageCertifications[] | undefined
  maxDraught: string | number | null
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
    userId: string
  ) => void
  getBulkTypes: (query: string) => void
  updateBulkCargo: (cargo: any) => void
  createBulkCargo: (cargo: any, navLogId: string) => void
  deleteBulkCargo: (id: string) => void
  updateComment: (id: string, description: string) => void
  uploadImgFile: (file: ImageFile, accessLevel: string) => any
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
  getTonnageCertifications: (id: string | number) => void
  setMaxDraught: (draught: string | number) => void
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
  isTonnageCertificateLoading: false,
  tonnageCertificates: [],
  maxDraught: null,
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
        userId: string
      ) => {
        set({isPlanningLoading: true})
        try {
          const response = await API.createNavlogComment(
            navLogId,
            comment,
            userId
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
        set({isPlanningLoading: true})
        try {
          const response = await API.updateBulkCargoEntry(cargo)
          set({isPlanningLoading: false})
          return response
        } catch (error) {
          set({isPlanningLoading: false})
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
      updateComment: async (id: string, description: string) => {
        set({isPlanningLoading: true})
        try {
          const response = await API.updateComment(id, description)
          set({isPlanningLoading: false})
          return response
        } catch (error) {
          set({isPlanningLoading: false})
        }
      },
      uploadImgFile: async (file: ImageFile, accessLevel: string) => {
        set({isPlanningLoading: true})
        try {
          const response = await API.uploadImgFile(file, accessLevel)
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
      getTonnageCertifications: (id: string | number) => {
        set({isTonnageCertificateLoading: true})

        API.getTonnageCertifications(id).then(response => {
          if (response?.status === 200) {
            get().setMaxDraught(
              Math.max(...response?.data?.map(item => item.draught))
            )
            set({
              isTonnageCertificateLoading: false,
              tonnageCertificates: response?.data,
            })
          }
        })
      },
      setMaxDraught: (maxDraught: string | number) => {
        set({maxDraught: maxDraught})
      },
    }),
    {
      name: 'planning-storage',
      getStorage: () => AsyncStorage,
    }
  )
)
