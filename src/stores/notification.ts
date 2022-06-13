import create from 'zustand'
import {persist} from 'zustand/middleware'
import AsyncStorage from '@react-native-async-storage/async-storage'

import * as API from '@bluecentury/api/vemasys'
import {TNotification} from '@bluecentury/api/models'

type NotifState = {
  notifications: TNotification[]
  isLoadingNotification: boolean
}

type NotifActions = {
  getAllNotifications: () => void
}

type NotifStore = NotifState & NotifActions

export const useNotif = create(
  persist<NotifStore>(
    set => ({
      isLoadingNotification: false,
      notifications: [],
      getAllNotifications: async () => {
        set({
          isLoadingNotification: true
        })
        try {
          const response = await API.getNotifications()
          set({
            isLoadingNotification: false,
            notifications: response
          })
        } catch (error) {
          set({
            isLoadingNotification: false
          })
        }
      }
    }),
    {
      name: 'notif-storage',
      getStorage: () => AsyncStorage
    }
  )
)
