import create from 'zustand'
import {persist} from 'zustand/middleware'
import AsyncStorage from '@react-native-async-storage/async-storage'
import * as API from '@bluecentury/api/vemasys'
import RNFS from 'react-native-fs'

type DraughtState = {
  isDraughtLoading: boolean
  draught: [] | undefined
}

type DraughtActions = {
  getDraught: () => void
  updateDraught: (beforeValue: any, afterValue: any) => void
}

const initialState: DraughtState = {
  isDraughtLoading: false,
  draught: [],
}

type DraughtStore = DraughtState & DraughtActions

const filePath = `${RNFS.DocumentDirectoryPath}/data.txt`

export const useDraught = create(
  persist<DraughtStore>(
    set => ({
      ...initialState,
      getDraught: () => {
        set({isDraughtLoading: false})
      },
      updateDraught: async (beforeValue: any, afterValue: any) => {
        set({isDraughtLoading: false})

        try {
          const jsonString = JSON.stringify([{beforeValue}, {afterValue}])

          console.log('jsonString', jsonString)
        } catch (error) {}
      },
    }),
    {
      name: 'crew-storage',
      getStorage: () => AsyncStorage,
    }
  )
)
