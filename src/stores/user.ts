import create from 'zustand'
import {persist} from 'zustand/middleware'
import AsyncStorage from '@react-native-async-storage/async-storage'
import * as API from '@bluecentury/api/vemasys'
import {
  Entity,
  EntityUser,
  User,
  UserRegistration,
  Vessel,
} from '@bluecentury/models'

type UserState = {
  isLoadingSignUpRequest: boolean
  user: User | null
  signUpRequestStatus: string
}

type EntityActions = {
  registerNewUser: (user: UserRegistration) => void
  createSignUpRequest: (userInfo: any, docs: Array<any>) => void
  reset: () => void
}

type EntityStore = UserState & EntityActions

const initialUserState: UserState = {
  isLoadingSignUpRequest: false,
  user: null,
  signUpRequestStatus: '',
}

export const useUser = create(
  persist<EntityStore>(
    (set, get) => ({
      ...initialUserState,
      registerNewUser: async (user: UserRegistration) => {
        set({isLoadingSignUpRequest: true})
        try {
          const response = await API.createSignUpRequest(userInfo, docs)
          set({signUpRequestStatus: response, isLoadingSignUpRequest: false})
        } catch (error) {
          set({isLoadingSignUpRequest: false})
        }
      },
      createSignUpRequest: async (userInfo: any, docs: Array<any>) => {
        set({isLoadingSignUpRequest: true})
        try {
          const response = await API.createSignUpRequest(userInfo, docs)
          set({signUpRequestStatus: response, isLoadingSignUpRequest: false})
        } catch (error) {
          set({isLoadingSignUpRequest: false})
        }
      },
      reset: () => {
        set({
          ...initialUserState,
        })
      },
    }),
    {
      name: 'user-storage',
      getStorage: () => AsyncStorage,
    }
  )
)
