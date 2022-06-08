import create from 'zustand';
import {persist} from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as API from '@bluecentury/api/vemasys';
import {TCredentials} from '@bluecentury/api/models';

type AuthState = {
  token: string | undefined;
  refreshToken: string | undefined;
  isAuthenticatingUser: boolean;
  hasAuthenticationError: boolean;
};

type AuthActions = {
  authenticate: (credentials: TCredentials) => void;
};

type AuthStore = AuthState & AuthActions;

export const useAuth = create(
  persist<AuthStore>(
    set => ({
      token: undefined,
      refreshToken: undefined,
      isAuthenticatingUser: false,
      hasAuthenticationError: false,
      authenticate: async (credentials: TCredentials) => {
        set({
          token: undefined,
          refreshToken: undefined,
          isAuthenticatingUser: true,
          hasAuthenticationError: false,
        });
        console.log(JSON.stringify(credentials));

        try {
          const response = await API.login(credentials);
          console.log(response);

          // set({
          //   token: response.token,
          //   refreshToken: response.refreshToken,
          //   isAuthenticatingUser: false,
          //   hasAuthenticationError: false,
          // });
        } catch (error) {
          set({
            token: undefined,
            refreshToken: undefined,
            isAuthenticatingUser: false,
            hasAuthenticationError: true,
          });
        }
      },
    }),
    {
      name: 'auth-storage',
      getStorage: () => AsyncStorage,
    },
  ),
);
