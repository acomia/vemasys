import create from 'zustand';
import {persist} from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as API from '@bluecentury/api/vemasys';

type NotificationState = {
  notifications: [];
  isLoadingNotification: boolean;
};

type NotificationActions = {
  getNotifications: () => void;
};

type NotificationStore = NotificationState & NotificationActions;

export const useNotification = create(
  persist<NotificationStore>(
    set => ({
      notifications: [],
      isLoadingNotification: false,
      getNotifications: async () => {
        set({
          isLoadingNotification: true,
        });
        try {
          const response = API.getNotification();
          console.log(response);
          set({
            notifications: response,
            isLoadingNotification: false,
          });
        } catch (error) {
          set({
            isLoadingNotification: false,
          });
        }
      },
    }),
    {
      name: 'notification-storage',
      getStorage: () => AsyncStorage,
    },
  ),
);
