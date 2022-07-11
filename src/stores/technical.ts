import create from 'zustand'
import {persist} from 'zustand/middleware'
import AsyncStorage from '@react-native-async-storage/async-storage'

import * as API from '@bluecentury/api/vemasys'

type TechnicalState = {
  isTechnicalLoading: boolean
  bunkering: [] | undefined
  gasoilReserviors: [] | undefined
  lastGasoilMeasurements: [] | undefined
  bunkeringSuppliers?: [] | undefined
  engines: [] | undefined
  reservoirs: [] | undefined
  lastWaterMeasurements: any[] | undefined
  tasksCategory?: [] | undefined
  tasksByCategory?: [] | undefined
  routinesCategory?: [] | undefined
}

type TechnicalActions = {
  getVesselBunkering: (vesselId: string) => void
  getVesselGasoilReservoirs: (physicalVesselId: string) => void
  getVesselBunkeringSuppliers: () => void
  createVesselBunkering?: (bunkering: any) => void
  getVesselEngines: (physicalVesselId: string) => void
  getVesselReservoirs?: (physicalVesselId: string) => void
  getVesselTasksCategory?: (vesselId: string) => void
  getVesselTasksByCategory?: (vesselId: string, categoryKey: string) => void
  createTaskComment?: (taskId: string, comment: string) => void
  deleteTask?: (taskId: string) => void
  createVesselTask?: (task: Task) => void
  updateVesselTask?: (taskId: string, task: Task) => void
  uploadTaskImageFile?: (
    subject: string,
    file: ImageFile,
    accessLevel: string,
    id: number
  ) => void
  getVesselRoutines?: (vesselId: string) => void
}

type TechnicalStore = TechnicalState & TechnicalActions

export const useTechnical = create(
  persist<TechnicalStore>(
    (set, get) => ({
      isTechnicalLoading: false,
      bunkering: [],
      gasoilReserviors: [],
      lastGasoilMeasurements: [],
      engines: [],
      reservoirs: [],
      lastWaterMeasurements: [],
      tasksCategory: [],
      tasksByCategory: [],
      getVesselBunkering: async (vesselId: string) => {
        set({isTechnicalLoading: true, bunkering: []})
        try {
          const response = await API.reloadVesselBunkering(vesselId)
          if (Array.isArray(response)) {
            set({
              isTechnicalLoading: false,
              bunkering: response
            })
          } else {
            set({
              isTechnicalLoading: false,
              bunkering: []
            })
          }
        } catch (error) {
          set({isTechnicalLoading: false})
        }
      },
      getVesselGasoilReservoirs: async (physicalVesselId: string) => {
        set({isTechnicalLoading: true, gasoilReserviors: []})
        try {
          const response = await API.reloadVesselGasoilReservoirs(
            physicalVesselId
          )
          if (response && response.length > 0) {
            const gasoilR = response
              .filter(
                (gasoil: {type: {title: string}}) =>
                  gasoil.type.title === 'Fuel'
              )
              .filter(
                (reservoir: {vesselZone: {physicalVessel: {id: any}}}) =>
                  reservoir?.vesselZone?.physicalVessel?.id === physicalVesselId
              )
            set({lastGasoilMeasurements: []})
            gasoilR.forEach(async reservoir => {
              set({isTechnicalLoading: true})
              const lastM = await API.reloadVesselPartLastMeasurements(
                reservoir.id
              )
              let lastGasoilM = get().lastGasoilMeasurements
              lastGasoilM?.push(lastM[0])
              set({lastGasoilMeasurements: lastGasoilM})
            })
          }
          if (Array.isArray(response)) {
            const gasoilR = response
              .filter(
                (gasoil: {type: {title: string}}) =>
                  gasoil.type.title === 'Fuel'
              )
              .filter(
                (reservoir: {vesselZone: {physicalVessel: {id: any}}}) =>
                  reservoir?.vesselZone?.physicalVessel?.id === physicalVesselId
              )
            set({
              isTechnicalLoading: false,
              gasoilReserviors: gasoilR
            })
          } else {
            set({
              isTechnicalLoading: false,
              gasoilReserviors: []
            })
          }
        } catch (error) {
          set({isTechnicalLoading: false})
        }
      },
      getVesselBunkeringSuppliers: async () => {
        set({isTechnicalLoading: true, bunkeringSuppliers: []})
        try {
          const response = await API.reloadVesselBunkeringSuppliers()

          if (Array.isArray(response)) {
            set({
              isTechnicalLoading: false,
              bunkeringSuppliers: response
            })
          } else {
            set({
              isTechnicalLoading: false,
              bunkeringSuppliers: []
            })
          }
        } catch (error) {
          set({isTechnicalLoading: false})
        }
      },
      createVesselBunkering: async (bunkering: any) => {
        set({isTechnicalLoading: true})
        try {
          const response = await API.createVesselBunkering(bunkering)
          return [response]
        } catch (error) {
          set({isTechnicalLoading: false})
        }
      },
      getVesselEngines: async (physicalVesselId: string) => {
        set({isTechnicalLoading: true, engines: []})
        try {
          const response = await API.reloadVesselEngines(physicalVesselId)
          if (Array.isArray(response)) {
            set({
              isTechnicalLoading: false,
              engines: response
            })
          } else {
            set({
              isTechnicalLoading: false,
              engines: []
            })
          }
        } catch (error) {
          set({isTechnicalLoading: false})
        }
      },
      getVesselReservoirs: async (physicalVesselId: string) => {
        set({isTechnicalLoading: true, reservoirs: []})
        try {
          const response = await API.reloadVesselReservoirs(physicalVesselId)

          if (Array.isArray(response)) {
            const waterTank = response.filter(res => res.type.title !== 'Fuel')
            let lastWaterM: any[] = []
            waterTank.forEach(async (tank, index) => {
              set({isTechnicalLoading: true})
              const lastM = await API.reloadVesselPartLastMeasurements(tank.id)
              lastWaterM?.push(lastM[0])
            })
            set({
              isTechnicalLoading: false,
              reservoirs: waterTank,
              lastWaterMeasurements: lastWaterM
            })
          } else {
            set({
              isTechnicalLoading: false,
              reservoirs: []
            })
          }
        } catch (error) {
          set({isTechnicalLoading: false})
        }
      },
      getVesselTasksCategory: async (vesselId: string) => {
        set({isTechnicalLoading: true, tasksCategory: []})
        try {
          const response = await API.reloadTasksCategory(vesselId)
          if (Array.isArray(response)) {
            set({
              isTechnicalLoading: false,
              tasksCategory: response
            })
          } else {
            set({
              isTechnicalLoading: false,
              tasksCategory: []
            })
          }
        } catch (error) {
          set({isTechnicalLoading: false})
        }
      },
      getVesselTasksByCategory: async (
        vesselId: string,
        categoryKey: string
      ) => {
        set({isTechnicalLoading: true, tasksByCategory: []})
        try {
          const response = await API.reloadTasksByCategory(
            vesselId,
            categoryKey
          )
          if (Array.isArray(response)) {
            set({
              isTechnicalLoading: false,
              tasksByCategory: response
            })
          } else {
            set({
              isTechnicalLoading: false,
              tasksByCategory: []
            })
          }
        } catch (error) {
          set({isTechnicalLoading: false})
        }
      },
      createTaskComment: async (taskId: string, comment: string) => {
        set({isTechnicalLoading: true})
        try {
          const response = await API.createTaskComment(taskId, comment)
          return [response]
        } catch (error) {
          set({isTechnicalLoading: false})
        }
      },
      deleteTask: async (taskId: string) => {
        set({isTechnicalLoading: true})
        try {
          const response = await API.deleteVesselTask(taskId)
          set({isTechnicalLoading: false})
          return [response]
        } catch (error) {
          set({isTechnicalLoading: false})
        }
      },
      createVesselTask: async (task: Task) => {
        set({isTechnicalLoading: true})
        try {
          const response = await API.createVesselTask(task)
          console.log('createTask', response)
          set({isTechnicalLoading: false})
          return response
        } catch (error) {
          set({isTechnicalLoading: false})
        }
      },
      updateVesselTask: async (taskId: string, task: Task) => {
        set({isTechnicalLoading: true})
        try {
          const response = await API.updateVesselTask(taskId, task)
          set({isTechnicalLoading: false})
          return response
        } catch (error) {
          set({isTechnicalLoading: false})
        }
      },
      uploadTaskImageFile: async (
        subject: string,
        file: ImageFile,
        accessLevel: string,
        id: number
      ) => {
        set({isTechnicalLoading: true})
        try {
          const response = await API.uploadTaskImageFile(
            subject,
            file,
            accessLevel,
            id
          )
          set({isTechnicalLoading: false})
          return response
        } catch (error) {
          set({isTechnicalLoading: false})
        }
      },
      getVesselRoutines: async (vesselId: string) => {
        set({isTechnicalLoading: true, routinesCategory: []})
        try {
          const response = await API.reloadRoutines(vesselId)
          if (Array.isArray(response)) {
            set({
              isTechnicalLoading: false,
              routinesCategory: response
            })
          } else {
            set({
              isTechnicalLoading: false,
              routinesCategory: []
            })
          }
        } catch (error) {
          set({isTechnicalLoading: false})
        }
      }
    }),
    {
      name: 'technical-storage',
      getStorage: () => AsyncStorage
    }
  )
)
