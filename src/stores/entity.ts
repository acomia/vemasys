import create from 'zustand'
import {persist} from 'zustand/middleware'
import AsyncStorage from '@react-native-async-storage/async-storage'
import * as API from '@bluecentury/api/vemasys'
import {ENTITY_TYPE_EXPLOITATION_VESSEL} from '@bluecentury/constants'
import {
  CommentWaitingForUpload,
  Entity,
  EntityUser,
  User,
  Vessel,
} from '@bluecentury/models'
import {useSettings} from '@bluecentury/stores/settings'

type EntityState = {
  hasEntityHydrated: boolean
  hasErrorLoadingCurrentUser: boolean
  hasErrorLoadingEntityUsers: boolean
  isLoadingCurrentUserInfo: boolean
  isLoadingEntityUsers: boolean
  isLoadingPendingRoles: boolean
  user: User | null
  userVessels: Array<any>
  entityUsers: Array<EntityUser>
  entityId: string | number | undefined
  entityType: string | number | undefined
  entityRole: string
  entityUserId: string | number | undefined
  linkEntity: object | null
  vesselId: string
  vesselDetails: Vessel | undefined
  selectedVessel: Entity | null
  selectedEntity: EntityUser | null
  physicalVesselId: string
  fleetVessel: number
  pendingRoles: Array<any>
  acceptRoleStatus: string
  commentsWaitingForUpload: CommentWaitingForUpload[]
  rejectedComments: CommentWaitingForUpload[]
  areCommentsUploading: boolean
  uploadingCommentNumber: number
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
  updatePendingRole: (id: string, accept: boolean) => void
  getLinkEntityInfo: (id: string) => void
  setCommentsWaitingForUpload: (
    comment: CommentWaitingForUpload | string
  ) => void
  setRejectedComments: (comment: CommentWaitingForUpload | string) => void
  setAreCommentsUploading: (value: boolean) => void
  setUploadingCommentNumber: (value: number) => void
}

type EntityStore = EntityState & EntityActions

const initialEntityState: EntityState = {
  hasEntityHydrated: false,
  hasErrorLoadingCurrentUser: false,
  hasErrorLoadingEntityUsers: false,
  isLoadingCurrentUserInfo: false,
  isLoadingEntityUsers: false,
  isLoadingPendingRoles: false,
  user: null,
  userVessels: [],
  entityUsers: [],
  entityId: undefined,
  entityType: '',
  entityRole: '',
  entityUserId: undefined,
  linkEntity: null,
  vesselId: '',
  vesselDetails: undefined,
  selectedVessel: null,
  selectedEntity: null,
  physicalVesselId: '',
  fleetVessel: 0,
  pendingRoles: [],
  acceptRoleStatus: '',
  commentsWaitingForUpload: [],
  rejectedComments: [],
  areCommentsUploading: false,
  uploadingCommentNumber: 0,
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
          user: null,
          isLoadingCurrentUserInfo: true,
          hasErrorLoadingCurrentUser: false,
        })
        try {
          console.log('getUserInfo')
          const response = await API.getUserInfo()
          const setLanguage = useSettings.getState().setLanguage
          const currentLanguage = useSettings.getState().language

          set({
            user: response,
            isLoadingCurrentUserInfo: false,
          })
          if (response && currentLanguage !== response.language) {
            if (response.language === 'en' || response.language === 'fr') {
              setLanguage(response.language)
            } else {
              setLanguage(currentLanguage ? currentLanguage : 'en')
            }
          }
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
      selectEntityUser: async (entity: EntityUser) => {
        set({fleetVessel: 0})
        const entityRole = entity.role.title
        const entityType = entity.entity.type.title
        const physicalVesselId =
          ENTITY_TYPE_EXPLOITATION_VESSEL === entityType &&
          entity.entity.exploitationVessel?.physicalVessel
            ? entity.entity.exploitationVessel.physicalVessel.id
            : entity.entity.exploitationGroup?.exploitationVessels[0]
                .physicalVessel.id
        const vesselId =
          ENTITY_TYPE_EXPLOITATION_VESSEL === entityType
            ? entity.entity.exploitationVessel?.id
            : entity.entity.exploitationGroup?.exploitationVessels[0].id

        const selectedVessel =
          ENTITY_TYPE_EXPLOITATION_VESSEL === entityType
            ? entity.entity
            : entity.entity.exploitationGroup &&
              entity.entity.exploitationGroup.exploitationVessels[0].entity

        set({
          entityId: entity.entity.id,
          entityUserId: entity.id,
          entityRole: entityRole,
          physicalVesselId: `${physicalVesselId}`,
          entityType: entityType,
          vesselId: `${vesselId}`,
          selectedVessel: selectedVessel,
          selectedEntity: entity,
        })
        try {
          const response = await API.getVesselNavigationDetails(`${vesselId}`)
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
        set({isLoadingPendingRoles: true, pendingRoles: []})
        try {
          const response = await API.getRoleForAccept(get().user?.id)
          set({pendingRoles: response, isLoadingPendingRoles: false})
        } catch (error) {
          set({
            isLoadingEntityUsers: false,
          })
        }
      },
      updatePendingRole: async (id: string, accept: boolean) => {
        set({isLoadingPendingRoles: true})
        try {
          const response = accept
            ? await API.acceptPendingRole(id)
            : await API.rejectPendingRole(id)
          set({acceptRoleStatus: response})
        } catch (error) {
          set({isLoadingPendingRoles: false})
        }
      },
      getLinkEntityInfo: async (id: string) => {
        set({isLoadingEntityUsers: true})
        try {
          const response = await API.getEntityInfo(id)
          set({linkEntity: response, isLoadingEntityUsers: false})
        } catch (error) {
          set({isLoadingEntityUsers: false})
        }
      },
      setCommentsWaitingForUpload: comment => {
        const comments = get().commentsWaitingForUpload
        if (comment === 'clear') {
          set({commentsWaitingForUpload: []})
          return
        }
        if (typeof comment !== 'string') {
          set({commentsWaitingForUpload: [comment, ...comments]})
        }
        console.log('WAITING_FOR_UPLOAD', get().commentsWaitingForUpload)
      },
      setRejectedComments: comment => {
        const comments = get().rejectedComments
        if (comment === 'clear') {
          set({rejectedComments: []})
          return
        }
        if (typeof comment !== 'string') {
          set({rejectedComments: [comment, ...comments]})
        }
      },
      setAreCommentsUploading: value => {
        set({areCommentsUploading: value})
      },
      setUploadingCommentNumber: value => {
        set({uploadingCommentNumber: value})
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
