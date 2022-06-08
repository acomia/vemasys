import create from 'zustand';
import {persist} from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

type SettingsState = {
  isDarkMode: boolean;
  language: string;
};

type SettingsActions = {
  setDarkMode: (val: boolean) => void;
  setLanguage: (lang: string) => void;
};

type SettingsStore = SettingsState & SettingsActions;

export const useSettings = create(
  persist<SettingsStore>(
    set => ({
      isDarkMode: false,
      language: 'en',
      setDarkMode: async (darkMode: boolean) => {
        set({
          isDarkMode: darkMode,
        });
      },
      setLanguage: (lang: string) => {
        set({language: lang});
      },
    }),
    {
      name: 'settings-storage',
      getStorage: () => AsyncStorage,
    },
  ),
);
