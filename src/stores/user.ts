import create from 'zustand'
import {persist} from 'zustand/middleware'
import AsyncStorage from '@react-native-async-storage/async-storage'
import * as API from '@bluecentury/api/vemasys'
import {
  ExtendedUser,
  SignupDocs,
  User,
  UserRegistration,
  Entity,
  LevelNavigationCertificate,
} from '@bluecentury/models'
import {useEntity} from './entity'
import {updateUserInfo} from '@bluecentury/api/vemasys'

type UserState = {
  isLoadingRegistration: boolean
  isLoadingUpdateUserInfo: boolean
  isLoadingSignupRequest: boolean
  user: ExtendedUser | null
  entityData: Array<Entity>
  registrationStatus: string
  updateUserInfoStatus: string
  requestAccessToEntityStatus: string
  signupRequestStatus: string
  levelNavigationCertificate: Array<LevelNavigationCertificate>
  isResetPasswordLoading: boolean
  isResetPasswordSuccess: boolean
}

type UserActions = {
  registerNewUser: (user: UserRegistration) => void
  updateUserData: (user: ExtendedUser, signupDocs: Array<SignupDocs>) => void
  getEntityData: (mmsi: number) => void
  requestAccessToEntity: (entityID: string) => void
  createSignupRequestForCurrentUser: (
    user: ExtendedUser,
    signupDocs: Array<SignupDocs>
  ) => void
  getLevelOfNavigationCertificate: () => void
  getEntityAdminUser: () => void
  reset: () => void
  resetPassword: (id: number, data: object) => void
  unmountResetPassword: () => void
}

type UserStore = UserState & UserActions

const initialUserState: UserState = {
  isLoadingRegistration: false,
  isLoadingUpdateUserInfo: false,
  isLoadingSignupRequest: false,
  user: null,
  entityData: [],
  registrationStatus: '',
  updateUserInfoStatus: '',
  requestAccessToEntityStatus: '',
  signupRequestStatus: '',
  levelNavigationCertificate: [],
  isResetPasswordLoading: false,
  isResetPasswordSuccess: false,
}

export const useUser = create(
  persist<UserStore>(
    (set, get) => ({
      ...initialUserState,
      registerNewUser: async (user: UserRegistration) => {
        set({isLoadingRegistration: true})
        try {
          const response = await API.registerNewUser(user)
          if (response.id) {
            set({
              registrationStatus: 'SUCCESS',
              user: response,
              isLoadingRegistration: false,
            })
          } else {
            set({registrationStatus: 'FAILED', isLoadingRegistration: false})
          }
        } catch (error) {
          set({registrationStatus: 'FAILED', isLoadingRegistration: false})
        }
      },
      updateUserData: async (
        user: ExtendedUser,
        signupDocs: Array<SignupDocs>
      ) => {
        set({isLoadingUpdateUserInfo: true})
        try {
          const response = await API.updateUserData(user, signupDocs)
          if (response.id) {
            set({
              updateUserInfoStatus: 'SUCCESS',
              user: response,
              isLoadingUpdateUserInfo: false,
            })
          } else {
            set({
              updateUserInfoStatus: 'FAILED',
              isLoadingUpdateUserInfo: false,
            })
          }
        } catch (error) {
          set({updateUserInfoStatus: 'FAILED', isLoadingUpdateUserInfo: false})
        }
      },
      getEntityData: async (mmsi: number) => {
        set({isLoadingRegistration: true, entityData: []})
        try {
          const response = await API.getEntityData(mmsi)
          if (response.length > 0) {
            useEntity.setState({entityUserId: response[0].id})
            set({entityData: response, isLoadingRegistration: false})
          } else {
            set({entityData: [], isLoadingRegistration: false})
          }
        } catch (error) {
          set({isLoadingRegistration: false})
        }
      },
      requestAccessToEntity: async (entityID: string) => {
        set({isLoadingRegistration: true})
        try {
          const response = await API.requestAccessToEntity(entityID)
          console.log('request access to entity: ', response)
          if (response.id) {
            set({
              requestAccessToEntityStatus: 'SUCCESS',
              isLoadingRegistration: false,
            })
          } else {
            set({
              requestAccessToEntityStatus: 'FAILED',
              isLoadingRegistration: false,
            })
          }
        } catch (error) {
          set({
            requestAccessToEntityStatus: 'FAILED',
            isLoadingRegistration: false,
          })
        }
      },
      createSignupRequestForCurrentUser: async (
        user: ExtendedUser,
        signupDocs: Array<SignupDocs>
      ) => {
        set({isLoadingSignupRequest: true})
        try {
          const response = await API.createSignupRequestForCurrentUser(
            user,
            signupDocs
          )
          if (typeof response === 'object' && response.mmsi) {
            set({
              signupRequestStatus: 'SUCCESS',
              isLoadingSignupRequest: false,
            })
          } else {
            set({signupRequestStatus: 'FAILED', isLoadingSignupRequest: false})
          }
        } catch (error) {
          set({signupRequestStatus: 'FAILED', isLoadingSignupRequest: false})
        }
      },
      getLevelOfNavigationCertificate: async () => {
        set({isLoadingSignupRequest: true})
        try {
          const response = await API.getLevelOfNavigationCertificate()
          if (response) {
            set({
              levelNavigationCertificate: response,
              isLoadingSignupRequest: false,
            })
          } else {
            set({isLoadingSignupRequest: false})
          }
        } catch (error) {
          set({isLoadingSignupRequest: false})
        }
      },
      getEntityAdminUser: async () => {
        set({isLoadingRegistration: true})
        try {
          const response = await API.getLevelOfNavigationCertificate()
          if (response) {
            set({
              isLoadingRegistration: false,
            })
          } else {
            set({isLoadingRegistration: false})
          }
        } catch (error) {
          set({isLoadingRegistration: false})
        }
      },
      reset: () => {
        set({
          registrationStatus: '',
          updateUserInfoStatus: '',
          requestAccessToEntityStatus: '',
          signupRequestStatus: '',
        })
      },
      resetPassword: async (id: number, data: object) => {
        set({isResetPasswordLoading: true})
        try {
          const userResponse = await updateUserInfo(id, data)

          if (typeof userResponse === 'object') {
            set({isResetPasswordSuccess: true, isResetPasswordLoading: false})
          }

          set({isResetPasswordLoading: false, isResetPasswordSuccess: false})
        } catch (error) {
          set({isResetPasswordLoading: false, isResetPasswordSuccess: false})
        }
      },
      unmountResetPassword: () => {
        set({isResetPasswordLoading: false, isResetPasswordSuccess: false})
      },
    }),
    {
      name: 'user-storage',
      getStorage: () => AsyncStorage,
    }
  )
)
