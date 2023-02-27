import create from 'zustand'
import {persist} from 'zustand/middleware'
import AsyncStorage from '@react-native-async-storage/async-storage'

import * as API from '@bluecentury/api/vemasys'
import {Notification} from '@bluecentury/models'
import {get} from 'lodash'

type NotifState = {
  notifications: Notification[]
  isLoadingNotification: boolean
  isLoadingReadNotification: boolean
  isLoadingMarkAllAsRead: boolean
  notificationBadge: number
}

type NotifActions = {
  getAllNotifications: () => void
  readNotif: (notifId: number, read: boolean) => void
  markAllAsReadNotif: () => void
  calculateBadge: () => void
}

type NotifStore = NotifState & NotifActions

const initialState: NotifState = {
  notifications: [],
  isLoadingNotification: false,
  isLoadingReadNotification: false,
  isLoadingMarkAllAsRead: false,
  notificationBadge: 0,
}

export const useNotif = create(
  persist<NotifStore>(
    (set, get) => ({
      ...initialState,
      getAllNotifications: async () => {
        set({
          isLoadingNotification: true,
        })
        try {
          const response = await API.getNotifications()
          if (Array.isArray(response)) {
            set({
              isLoadingNotification: false,
              notifications: response,
            })
          } else {
            set({
              isLoadingNotification: false,
              notifications: [],
            })
          }
        } catch (error) {
          set({
            isLoadingNotification: false,
          })
        }
      },
      readNotif: (notifId: number, read: boolean) => {
        set({
          isLoadingReadNotification: true,
        })

        API.readNotification(notifId, read)
          .then(response => {
            if (response) {
              set({
                isLoadingReadNotification: false,
              })
            }
          })
          .catch(error => {
            set({
              isLoadingMarkAllAsRead: false,
            })
          })
      },
      markAllAsReadNotif: () => {
        set({
          isLoadingMarkAllAsRead: true,
        })

        API.markAllAsReadNotif()
      },
      calculateBadge: async () => {
        let count = 0
        get().notifications?.map(notification => {
          if (notification.read === false) {
            count = count + 1
          }
        })
        set({notificationBadge: count})
      },
    }),
    {
      name: 'notif-storage',
      getStorage: () => AsyncStorage,
    }
  )
)
