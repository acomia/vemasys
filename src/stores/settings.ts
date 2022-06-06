import create from 'zustand';
import {persist} from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

type SettingsState = {
  isDarkMode: boolean;
};

type SettingsActions = {
  setDarkMode: (val: boolean) => void;
};

type SettingsStore = SettingsState & SettingsActions;

export const useSettings = create(
  persist<SettingsStore>(
    set => ({
      isDarkMode: false,
      setDarkMode: async (darkMode: boolean) => {
        set({
          isDarkMode: darkMode,
        });
      },
    }),
    {
      name: 'settings-storage',
      getStorage: () => AsyncStorage,
    },
  ),
);
