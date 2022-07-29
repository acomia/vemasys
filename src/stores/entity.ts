import create from 'zustand'
import {persist} from 'zustand/middleware'
import AsyncStorage from '@react-native-async-storage/async-storage'
import * as API from '@bluecentury/api/vemasys'
import {ENTITY_TYPE_EXPLOITATION_VESSEL} from '@bluecentury/constants'
import {VesselDetails} from '@bluecentury/types'

type EntityState = {
  hasErrorLoadingCurrentUser: boolean
  hasErrorLoadingEntityUsers: boolean
  isLoadingCurrentUserInfo: boolean
  isLoadingEntityUsers: boolean
  user: []
  userVessels: []
  entityUsers: []
  entityId: string
  entityType: string
  entityRole: string
  entityUserId: string
  vesselId: string
  vesselDetails: VesselDetails | undefined
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
}

type EntityStore = EntityState & EntityActions

const initialEntityState: EntityState = {
  hasErrorLoadingCurrentUser: false,
  hasErrorLoadingEntityUsers: false,
  isLoadingCurrentUserInfo: false,
  isLoadingEntityUsers: false,
  user: [],
  userVessels: [],
  entityUsers: [],
  entityId: '',
  entityType: '',
  entityRole: '',
  entityUserId: '',
  vesselId: '',
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

        set({
          entityId: entity.entity.id,
          entityUserId: entity.id,
          entityRole,
          physicalVesselId,
          entityType,
          vesselId:
            ENTITY_TYPE_EXPLOITATION_VESSEL === entityType
              ? entity.entity.exploitationVessel.id
              : entity.entity.exploitationGroup.exploitationVessels[0].id,
          selectedVessel: entity.entity,
          selectedEntity: entity
        })
        try {
          await API.selectEntityUser(entity.id)
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
      }
    }),
    {
      name: 'entity-storage',
      getStorage: () => AsyncStorage
    }
  )
)
