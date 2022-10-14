import create from 'zustand'
import {persist} from 'zustand/middleware'
import AsyncStorage from '@react-native-async-storage/async-storage'
import * as API from '@bluecentury/api/vemasys'

type CrewState = {
  isCrewLoading: boolean
  crew: [] | undefined
  planning: [] | undefined
  roles: []
}

type CrewActions = {
  getCrew: (vesselId: string) => void
  getCrewPlanning: (vesselId: string) => void
  getUserRoles: () => void
  createNewUser: (entityId: any, user: any) => void
}

type CrewStore = CrewState & CrewActions

export const useCrew = create(
  persist<CrewStore>(
    set => ({
      isCrewLoading: false,
      crew: [],
      planning: [],
      roles: [],
      getCrew: async (vesselId: string) => {
        set({
          isCrewLoading: true,
          crew: [],
        })
        try {
          const response = await API.reloadCrew(vesselId)
          if (Array.isArray(response)) {
            const res = [response].reduce((acc, crewMember) => {
              crewMember = Object.assign({}, crewMember, {
                exploitationVessel: {
                  id: vesselId,
                },
              })
              const index = acc.findIndex(
                (c: {id: any}) => c.id === crewMember.id
              )

              if (index !== -1) {
                acc[index] = Object.assign({}, acc[index], crewMember)
              } else {
                acc.push(crewMember)
              }
              return acc
            })
            set({crew: res, isCrewLoading: false})
          } else {
            set({isCrewLoading: false})
          }
        } catch (error) {
          set({isCrewLoading: false})
        }
      },
      getCrewPlanning: async (vesselId: string) => {
        set({isCrewLoading: true})
        try {
          const response = await API.reloadCrewPlanning(vesselId)
          if (Array.isArray(response)) {
            const res = [response].reduce((acc, planningItem) => {
              const index = acc.findIndex(p => p.id === planningItem.id)

              if (index !== -1) {
                acc[index] = Object.assign({}, acc[index], planningItem)
              } else {
                acc.push(planningItem)
              }

              return acc
            })

            set({planning: res, isCrewLoading: false})
          } else {
            set({isCrewLoading: false})
          }
        } catch (error) {
          set({isCrewLoading: false})
        }
      },
      getUserRoles: async () => {
        set({isCrewLoading: true})
        try {
          const response = await API.reloadUserRoles()
          if (Array.isArray(response)) {
            set({
              isCrewLoading: false,
              roles: response?.map(role => {
                return {label: role.title, value: role.id}
              }),
            })
          }
        } catch (error) {
          set({isCrewLoading: false})
        }
      },
      createNewUser: async (entityId: any, user: any) => {
        set({isCrewLoading: true})
        try {
          const response = await API.createNewUser(entityId, user)
          set({isCrewLoading: false})
          return response
        } catch (error) {
          set({isCrewLoading: false})
        }
      },
    }),
    {
      name: 'crew-storage',
      getStorage: () => AsyncStorage,
    }
  )
)
