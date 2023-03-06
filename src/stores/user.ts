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

type UserState = {
  isLoadingRegistration: boolean
  isLoadingUpdateUserInfo: boolean
  isLoadingSignupRequest: boolean
  user: ExtendedUser | null
  entityData: Entity | null
  registrationStatus: string
  updateUserInfoStatus: string
  levelNavigationCertificate: Array<LevelNavigationCertificate>
}

type UserActions = {
  registerNewUser: (user: UserRegistration) => void
  updateUserInfo: (user: ExtendedUser, signupDocs: Array<SignupDocs>) => void
  getEntityData: (mmsi: number) => void
  requestAccessToEntity: (entity: string) => void
  createSignupRequestForCurrentUser: (user: ExtendedUser) => void
  getLevelOfNavigationCertificate: () => void
  reset: () => void
}

type UserStore = UserState & UserActions

const initialUserState: UserState = {
  isLoadingRegistration: false,
  isLoadingUpdateUserInfo: false,
  isLoadingSignupRequest: false,
  user: null,
  entityData: null,
  registrationStatus: '',
  updateUserInfoStatus: '',
  levelNavigationCertificate: [],
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
      updateUserInfo: async (
        user: ExtendedUser,
        signupDocs: Array<SignupDocs>
      ) => {
        set({isLoadingUpdateUserInfo: true})
        try {
          const response = await API.updateUserInfo(user, signupDocs)
          console.log('update info:', response)
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
        set({isLoadingSignupRequest: true})
        try {
          const response = await API.getEntityData(mmsi)
          console.log('Entity: ', response)
          if (response) {
            set({entityData: response, isLoadingSignupRequest: false})
          } else {
            set({isLoadingSignupRequest: false})
          }
        } catch (error) {
          set({isLoadingSignupRequest: false})
        }
      },
      requestAccessToEntity: async (entity: string) => {
        set({isLoadingRegistration: true})
        try {
          const response = await API.requestAccessToEntity(entity)
          console.log('register: ', response)
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
      createSignupRequestForCurrentUser: async (user: ExtendedUser) => {
        set({isLoadingRegistration: true})
        try {
          const response = await API.createSignupRequestForCurrentUser(user)
          console.log('register: ', response)
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
      reset: () => {
        set({
          registrationStatus: '',
          updateUserInfoStatus: '',
        })
      },
    }),
    {
      name: 'user-storage',
      getStorage: () => AsyncStorage,
    }
  )
)
