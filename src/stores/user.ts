import create from 'zustand'
import {persist} from 'zustand/middleware'
import AsyncStorage from '@react-native-async-storage/async-storage'
import {API} from '@bluecentury/api/apiService'
import {updateUserInfo} from '@bluecentury/api/vemasys'

type UserState = {
  isResetPasswordLoading: boolean
  isResetPasswordSuccess: boolean
}

type UserActions = {
  resetPassword: (id: number, data: object) => void
  unmountResetPassword: () => void
}

type UserStore = UserState & UserActions

const initialState: UserState = {
  isResetPasswordLoading: false,
  isResetPasswordSuccess: false,
}

export const useUser = create(
  persist<UserStore>(
    set => ({
      ...initialState,
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
      name: 'crew-storage',
      getStorage: () => AsyncStorage,
    }
  )
)
