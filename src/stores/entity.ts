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
  fleetVessel: number
}

type EntityActions = {
  getUserInfo: () => void
  getEntityUsers: () => void
  selectEntityUser: (entity: any) => void
  selectFleetVessel: (index: number, entity: any) => void
  setHasHydrated: (state: boolean) => void
  reset: () => void
  updateVesselDetails: () => void
  getRoleForAccept: () => void
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
  fleetVessel: 0,
}

export const useEntity = create(
  persist<EntityStore>(
    (set, get) => ({
      ...initialEntityState,
      updateVesselDetails: async () => {
        try {
          const response = await API.getVesselNavigationDetails(get().vesselId)
          console.log('VESSEL_UPDATE_RESPONSE', response)
          set({
            vesselDetails: response,
          })
        } catch (error) {
          set({
            isLoadingEntityUsers: false,
          })
        }
      },
      getUserInfo: async () => {
        set({
          user: [],
          isLoadingCurrentUserInfo: true,
          hasErrorLoadingCurrentUser: false,
        })
        try {
          const response = await API.reloadUser()
          set({
            user: response,
            isLoadingCurrentUserInfo: false,
          })
        } catch (error) {
          set({
            hasErrorLoadingCurrentUser: true,
            isLoadingCurrentUserInfo: false,
          })
        }
      },
      getEntityUsers: async () => {
        set({
          entityUsers: [],
          isLoadingEntityUsers: true,
          hasErrorLoadingEntityUsers: false,
        })
        try {
          const response = await API.reloadEntityUsers()
          if (Array.isArray(response)) {
            set({
              entityUsers: response,
              isLoadingEntityUsers: false,
            })
          } else {
            set({
              entityUsers: [],
              isLoadingEntityUsers: false,
              hasErrorLoadingEntityUsers: true,
            })
          }
        } catch (error) {
          set({
            isLoadingEntityUsers: false,
            hasErrorLoadingEntityUsers: true,
          })
        }
      },
      selectEntityUser: async (entity: any) => {
        set({fleetVessel: 0})
        const entityRole = entity.role.title
        const entityType = entity.entity.type.title
        const physicalVesselId =
          ENTITY_TYPE_EXPLOITATION_VESSEL === entityType &&
          entity.entity.exploitationVessel.physicalVessel
            ? entity.entity.exploitationVessel.physicalVessel.id
            : entity.entity.exploitationGroup.exploitationVessels[0]
                .physicalVessel.id
        const vesselId =
          ENTITY_TYPE_EXPLOITATION_VESSEL === entityType
            ? entity.entity.exploitationVessel.id
            : entity.entity.exploitationGroup.exploitationVessels[0].id

        const selectedVessel =
          ENTITY_TYPE_EXPLOITATION_VESSEL === entityType
            ? entity.entity
            : entity.entity.exploitationGroup.exploitationVessels[0].entity

        set({
          entityId: entity.entity.id,
          entityUserId: entity.id,
          entityRole: entityRole,
          physicalVesselId: physicalVesselId,
          entityType: entityType,
          vesselId: vesselId,
          selectedVessel: selectedVessel,
          selectedEntity: entity,
        })
        try {
          const response = await API.getVesselNavigationDetails(vesselId)
          set({
            vesselDetails: response,
          })
        } catch (error) {
          set({
            isLoadingEntityUsers: false,
          })
        }
      },
      selectFleetVessel: async (index: number, entity: any) => {
        const physicalVesselId =
          typeof entity.entity.exploitationVessel === 'object' &&
          entity.entity.exploitationVessel.physicalVessel
            ? entity.entity.exploitationVessel.physicalVessel.id
            : entity.physicalVessel.id
        const vesselId =
          typeof entity.entity.exploitationVessel === 'object'
            ? entity.entity.exploitationVessel.id
            : entity.id
        const entityId =
          typeof entity.entity.exploitationVessel === 'object'
            ? entity.entity.id
            : get().entityId
        const entityUserId =
          typeof entity.entity.exploitationVessel === 'object'
            ? entity.id
            : get().entityUserId

        set({
          fleetVessel: index,
          entityId: entityId,
          entityUserId: entityUserId,
          physicalVesselId: physicalVesselId,
          vesselId: vesselId,
          selectedVessel: entity.entity,
        })
        try {
          const response = await API.getVesselNavigationDetails(vesselId)
          set({
            vesselDetails: response,
          })
        } catch (error) {
          set({
            isLoadingEntityUsers: false,
          })
        }
      },
      setHasHydrated: state => {
        set({
          hasEntityHydrated: state,
        })
      },
      getRoleForAccept: async () => {
        console.log('userID', get().user?.id)
        try {
          const response = await API.getRoleForAccept(get().user?.id)
          console.log('Accept Role', response)
        } catch (error) {
          set({
            isLoadingEntityUsers: false,
          })
        }
      },
      reset: () => {
        set({
          ...initialEntityState,
          hasEntityHydrated: true,
        })
      },
    }),
    {
      name: 'entity-storage',
      getStorage: () => AsyncStorage,
      onRehydrateStorage: () => state => {
        state?.setHasHydrated(true)
      },
    }
  )
)
