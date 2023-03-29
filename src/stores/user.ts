import create from 'zustand'
import {persist} from 'zustand/middleware'
import AsyncStorage from '@react-native-async-storage/async-storage'
import {API} from '@bluecentury/api/apiService'

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
      resetPassword: (id: number, data: object) => {
        set({isResetPasswordLoading: true})

        API.put(`users/${id}`, data)
          .then(response => {
            console.log('response', response.status)
            if (response.status === 200) {
              set({isResetPasswordSuccess: true, isResetPasswordLoading: false})
              return
            }
            set({isResetPasswordLoading: false, isResetPasswordSuccess: false})
            return
          })
          .catch(error => {
            set({isResetPasswordLoading: false, isResetPasswordSuccess: false})
          })
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
