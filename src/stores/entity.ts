import create from 'zustand'
import {persist} from 'zustand/middleware'
import AsyncStorage from '@react-native-async-storage/async-storage'
import * as API from '@bluecentury/api/vemasys'
import {ENTITY_TYPE_EXPLOITATION_VESSEL} from '@bluecentury/constants'

type EntityState = {
  isLoadingEntityUsers: boolean
  user: []
  userVessels: []
  entityUsers: []
  entityId: string
  entityType: string
  entityRole: string
  entityUserId: string
  vesselId: string
  selectedVessel: {}
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
  getUserVessels: (userId: string) => void
  selectEntityUser: (entity: any) => void
}

type EntityStore = EntityState & EntityActions

export const useEntity = create(
  persist<EntityStore>(
    set => ({
      isLoadingEntityUsers: false,
      user: [],
      userVessels: [],
      entityUsers: [],
      entityId: '',
      entityType: '',
      entityRole: '',
      entityUserId: '',
      vesselId: '',
      selectedVessel: {},
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
      consumableTypeId: '',
      getUserInfo: async () => {
        set({
          isLoadingEntityUsers: true
        })
        try {
          const response = await API.reloadUser()
          set({
            user: response
          })
        } catch (error) {
          set({
            isLoadingEntityUsers: false
          })
        }
      },
      getEntityUsers: async () => {
        try {
          const response = await API.reloadEntityUsers()
          set({
            entityUsers: response,
            isLoadingEntityUsers: false
          })
        } catch (error) {
          set({
            isLoadingEntityUsers: false
          })
        }
      },
      getUserVessels: async (userId: string) => {
        try {
          const response = await API.reloadUserVessels(userId)
          console.log('UserVessels', response)
          set({
            userVessels: response
          })
        } catch (error) {
          set({
            isLoadingEntityUsers: false
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
          selectedVessel: entity.entity
        })
        try {
          API.selectEntityUser(entity.id)
        } catch (error) {}
      }
    }),
    {
      name: 'entity-storage',
      getStorage: () => AsyncStorage
    }
  )
)
