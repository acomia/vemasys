import create from 'zustand'
import {persist} from 'zustand/middleware'
import AsyncStorage from '@react-native-async-storage/async-storage'
import * as API from '@bluecentury/api/vemasys'
import RNFS from 'react-native-fs'

type DraughtState = {
  isDraughtLoading: boolean
  draughtTable: any | null | undefined
}

type DraughtActions = {
  getDraught: (id: number) => void
  updateDraught: (id: number, data: any) => void
}

const initialState: DraughtState = {
  isDraughtLoading: false,
  draughtTable: null,
}

type DraughtStore = DraughtState & DraughtActions

export const useDraught = create(
  persist<DraughtStore>(
    set => ({
      ...initialState,
      getDraught: async (id: number) => {
        set({isDraughtLoading: false})
        const filePath = `${RNFS.DocumentDirectoryPath}/data_${id}.txt`

        try {
          // it should be an API here

          const draughtResponse = await RNFS.readFile(filePath)
          if (draughtResponse) {
            set({draughtTable: JSON.parse(draughtResponse)})
          }
          set({isDraughtLoading: false})
        } catch (error) {
          set({isDraughtLoading: false})
        }
      },
      updateDraught: async (id: number, data: any) => {
        const filePath = `${RNFS.DocumentDirectoryPath}/data_${id}.txt`
        set({isDraughtLoading: true})

        try {
          const jsonString = JSON.stringify(data)

          // it should be an API here
          await RNFS.writeFile(filePath, jsonString, 'utf8')
          set({isDraughtLoading: false})
        } catch (error) {
          set({isDraughtLoading: false})
        }
      },
    }),
    {
      name: 'crew-storage',
      getStorage: () => AsyncStorage,
    }
  )
)
