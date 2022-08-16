import create from 'zustand'
import {persist} from 'zustand/middleware'
import AsyncStorage from '@react-native-async-storage/async-storage'
import * as API from '@bluecentury/api/vemasys'
import {ENTITY_TYPE_EXPLOITATION_VESSEL} from '@bluecentury/constants'
import {EntityUser, Vessel} from '@bluecentury/models'

type EntityState = {
  hasEntityHydrated: boolean
  hasErrorLoadingCurrentUser: boolean
  hasErrorLoadingEntityUsers: boolean
  isLoadingCurrentUserInfo: boolean
  isLoadingEntityUsers: boolean
  user: Array<any>
  userVessels: Array<any>
  entityUsers: Array<EntityUser>
  entityId: string | undefined
  entityType: string
  entityRole: string
  entityUserId: string | undefined
  vesselId: string | undefined
  vesselDetails: Vessel | undefined
  selectedVessel: {}
  selectedEntity: {}
  physicalVesselId: string
  navigationLog: any
  cargoEntryId: string
  reservoirId: string
  engineId: string
  taskId: string
  bunkeringId: string
  certificateId: string
  pegelId: string
  userCertificateId: string
  pdfUrl: string
  searchedUser: any
  engineGauge: any
  fleetVessel: number
  navigationLogId: string
  cargoEntry: any
  navigationLogActionId: string
  cargoHoldId: string
  crewMember: any
  userCertificate: any
  imageUrl: string
  consumableTypeId: string
}

type EntityActions = {
  getUserInfo: () => void
  getEntityUsers: () => void
  selectEntityUser: (entity: any) => void
  setHasHydrated: (state: boolean) => void
  reset: () => void
}

type EntityStore = EntityState & EntityActions

const initialEntityState: EntityState = {
  hasEntityHydrated: false,
  hasErrorLoadingCurrentUser: false,
  hasErrorLoadingEntityUsers: false,
  isLoadingCurrentUserInfo: false,
  isLoadingEntityUsers: false,
  user: [],
  userVessels: [],
  entityUsers: [],
  entityId: undefined,
  entityType: '',
  entityRole: '',
  entityUserId: undefined,
  vesselId: undefined,
  vesselDetails: undefined,
  selectedVessel: {},
  selectedEntity: {},
  physicalVesselId: '',
  navigationLog: null,
  cargoEntryId: '',
  reservoirId: '',
  engineId: '',
  taskId: '',
  bunkeringId: '',
  certificateId: '',
  pegelId: '',
  userCertificateId: '',
  pdfUrl: '',
  searchedUser: null,
  engineGauge: null,
  fleetVessel: 0,
  navigationLogId: '',
  cargoEntry: null,
  navigationLogActionId: '',
  cargoHoldId: '',
  crewMember: null,
  userCertificate: null,
  imageUrl: '',
  consumableTypeId: ''
}

export const useEntity = create(
  persist<EntityStore>(
    (set, get) => ({
      ...initialEntityState,
      getUserInfo: async () => {
        set({
          user: [],
          isLoadingCurrentUserInfo: true,
          hasErrorLoadingCurrentUser: false
        })
        try {
          const response = await API.reloadUser()
          set({
            user: response,
            isLoadingCurrentUserInfo: false
          })
        } catch (error) {
          set({
            hasErrorLoadingCurrentUser: true,
            isLoadingCurrentUserInfo: false
          })
        }
      },
      getEntityUsers: async () => {
        set({
          entityUsers: [],
          isLoadingEntityUsers: true,
          hasErrorLoadingEntityUsers: false
        })
        try {
          const response = await API.reloadEntityUsers()
          if (Array.isArray(response)) {
            set({
              entityUsers: response,
              isLoadingEntityUsers: false
            })
          } else {
            set({
              entityUsers: [],
              isLoadingEntityUsers: false,
              hasErrorLoadingEntityUsers: true
            })
          }
        } catch (error) {
          set({
            isLoadingEntityUsers: false,
            hasErrorLoadingEntityUsers: true
          })
        }
      },
      selectEntityUser: async (entity: any) => {
        const entityRole = entity.role.title
        const entityType = entity.entity.type.title
        const physicalVesselId =
          entity.entity.exploitationVessel &&
          entity.entity.exploitationVessel.physicalVessel
            ? entity.entity.exploitationVessel.physicalVessel.id
            : null

        const vesselId =
          ENTITY_TYPE_EXPLOITATION_VESSEL === entityType
            ? entity.entity.exploitationVessel.id
            : entity.entity.exploitationGroup.exploitationVessels[0].id

        set({
          entityId: entity.entity.id,
          entityUserId: entity.id,
          entityRole: entityRole,
          physicalVesselId: physicalVesselId,
          entityType: entityType,
          vesselId: vesselId,
          selectedVessel: entity.entity,
          selectedEntity: entity
        })
        try {
          const response = await API.getVesselNavigationDetails(
            entity.entity.exploitationVessel.id
          )
          set({
            vesselDetails: response
          })
        } catch (error) {
          set({
            isLoadingEntityUsers: false
          })
        }
      },
      setHasHydrated: state => {
        set({
          hasEntityHydrated: state
        })
      },
      reset: () => {
        set({
          ...initialEntityState,
          hasEntityHydrated: true
        })
      }
    }),
    {
      name: 'entity-storage',
      getStorage: () => AsyncStorage,
      onRehydrateStorage: () => state => {
        state?.setHasHydrated(true)
      }
    }
  )
)
