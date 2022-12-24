import create from 'zustand'
import {persist} from 'zustand/middleware'
import AsyncStorage from '@react-native-async-storage/async-storage'

import * as API from '@bluecentury/api/vemasys'
import moment from 'moment'

type TechnicalState = {
  isTechnicalLoading: boolean
  bunkering: any[]
  gasoilReserviors: any[]
  bunkeringSuppliers?: any[]
  engines: any[]
  reservoirs: any[]
  tasksCategory: any[]
  tasksByCategory: any[]
  routinesCategory: any[]
  routinesByCategory: any[]
  routineDetails: any[]
  certificates: any[]
  lastMeasurements: any[]
  inventory: any[]
  consumableTypes: any[]
}

type TechnicalActions = {
  getVesselBunkering?: (vesselId: string) => void
  getVesselGasoilReservoirs?: (physicalVesselId: string) => void
  getVesselBunkeringSuppliers?: () => void
  createVesselBunkering?: (bunkering: any) => void
  getVesselEngines?: (physicalVesselId: string) => void
  getVesselReservoirs?: (physicalVesselId: string) => void
  getVesselTasksCategory?: (vesselId: string) => void
  getVesselTasksByCategory?: (vesselId: string, categoryKey: string) => void
  createTaskComment?: (taskId: string, comment: string) => void
  deleteTask?: (taskId: string) => void
  createVesselTask?: (task: Task) => void
  updateVesselTask?: (taskId: string, task: Task) => void
  uploadFileBySubject?: (
    subject: string,
    file: ImageFile,
    accessLevel: string,
    id: number
  ) => void
  getVesselRoutines?: (vesselId: string) => void
  getVesselRoutinesByCategory?: (vesselId: string, categoryKey: string) => void
  getVesselRoutineDetails?: (id: string) => void
  getVesselCertificates?: (vesselId: string) => void
  getVesselPartLastMeasurements?: (id: string) => void
  createNewConsumptionMeasure: (resId: string, value: string) => void
  getVesselInventory?: (vesselId: string) => void
  getConsumableTypes?: () => void
  updateVesselInventoryItem?: (quantity: number, consumableId: number) => void
}

type TechnicalStore = TechnicalState & TechnicalActions

export const useTechnical = create(
  persist<TechnicalStore>(
    (set, get) => ({
      isTechnicalLoading: false,
      bunkering: [],
      gasoilReserviors: [],
      bunkeringSuppliers: [],
      engines: [],
      reservoirs: [],
      tasksCategory: [],
      tasksByCategory: [],
      routinesCategory: [],
      routinesByCategory: [],
      routineDetails: [],
      certificates: [],
      lastMeasurements: [],
      inventory: [],
      consumableTypes: [],
      getVesselBunkering: async (vesselId: string) => {
        set({isTechnicalLoading: true, bunkering: []})
        try {
          const response = await API.reloadVesselBunkering(vesselId)
          if (Array.isArray(response)) {
            set({
              isTechnicalLoading: false,
              bunkering: response,
            })
          } else {
            set({
              isTechnicalLoading: false,
              bunkering: [],
            })
          }
        } catch (error) {
          set({isTechnicalLoading: false})
        }
      },
      getVesselGasoilReservoirs: async (physicalVesselId: string) => {
        set({
          isTechnicalLoading: true,
          gasoilReserviors: [],
        })
        try {
          const response = await API.reloadVesselGasoilReservoirs(
            physicalVesselId
          )
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
            gasoilR.forEach(async reservoir => {
              set({isTechnicalLoading: true})
              const lastM = await API.reloadVesselPartLastMeasurements(
                reservoir.id
              )
              reservoir.lastMeasurement = lastM[0]
              set({
                isTechnicalLoading: false,
                gasoilReserviors: gasoilR,
              })
            })
          } else {
            set({
              isTechnicalLoading: false,
              gasoilReserviors: [],
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
              bunkeringSuppliers: response,
            })
          } else {
            set({
              isTechnicalLoading: false,
              bunkeringSuppliers: [],
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
            response.forEach(async (engine, index: number) => {
              const lastM = await API.reloadVesselPartLastMeasurements(
                engine.id
              )
              engine.lastMeasurement = lastM[0]
              set({
                isTechnicalLoading: false,
                engines: response,
              })
            })
          } else {
            set({
              isTechnicalLoading: false,
              engines: [],
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
            waterTank.forEach(async tank => {
              set({isTechnicalLoading: true})
              const lastM = await API.reloadVesselPartLastMeasurements(tank.id)
              tank.lastMeasurement = lastM[0]
              set({
                isTechnicalLoading: false,
                reservoirs: waterTank,
              })
            })
          } else {
            set({
              isTechnicalLoading: false,
              reservoirs: [],
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
              tasksCategory: response,
            })
          } else {
            set({
              isTechnicalLoading: false,
              tasksCategory: [],
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
              tasksByCategory: response,
            })
          } else {
            set({
              isTechnicalLoading: false,
              tasksByCategory: [],
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
          return response
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
      uploadFileBySubject: async (
        subject: string,
        file: ImageFile,
        accessLevel: string,
        id: number
      ) => {
        set({isTechnicalLoading: true})
        try {
          const response = await API.uploadFileBySubject(
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
              routinesCategory: response,
            })
          } else {
            set({
              isTechnicalLoading: false,
              routinesCategory: [],
            })
          }
        } catch (error) {
          set({isTechnicalLoading: false})
        }
      },
      getVesselCertificates: async (vesselId: string) => {
        set({isTechnicalLoading: true, certificates: []})
        try {
          const response = await API.reloadCertificates(vesselId)
          if (Array.isArray(response)) {
            const today = moment()
            response.forEach(c => {
              c.remainingDays = c.endDate
                ? moment(c.endDate).diff(today, 'days')
                : 0
            })
            set({
              isTechnicalLoading: false,
              certificates: response,
            })
          } else {
            set({
              isTechnicalLoading: false,
              certificates: [],
            })
          }
        } catch (error) {
          set({isTechnicalLoading: false})
        }
      },
      getVesselPartLastMeasurements: async (id: string) => {
        set({isTechnicalLoading: true, lastMeasurements: []})
        try {
          const response = await API.reloadVesselPartLastMeasurements(id)
          if (Array.isArray(response)) {
            set({
              isTechnicalLoading: false,
              lastMeasurements: response,
            })
          } else {
            set({
              isTechnicalLoading: false,
              lastMeasurements: [],
            })
          }
        } catch (error) {
          set({isTechnicalLoading: false})
        }
      },
      createNewConsumptionMeasure: async (resId: string, value: string) => {
        set({isTechnicalLoading: true})
        try {
          const response = await API.createNewConsumptionMeasure(resId, value)
          set({
            isTechnicalLoading: false,
          })
          return response
        } catch (error) {
          set({isTechnicalLoading: false})
        }
      },
      getVesselInventory: async (vesselId: string) => {
        set({isTechnicalLoading: true, inventory: []})
        try {
          const response = await API.reloadVesselInventory(vesselId)
          if (Array.isArray(response)) {
            set({isTechnicalLoading: false, inventory: response})
          } else {
            set({isTechnicalLoading: false, inventory: []})
          }
        } catch (error) {
          set({isTechnicalLoading: false})
        }
      },
      getConsumableTypes: async () => {
        set({isTechnicalLoading: true, consumableTypes: []})
        try {
          const response = await API.reloadConsumableTypes()
          if (Array.isArray(response)) {
            set({isTechnicalLoading: false, consumableTypes: response})
          } else {
            set({isTechnicalLoading: false, consumableTypes: []})
          }
        } catch (error) {
          set({isTechnicalLoading: false})
        }
      },
      updateVesselInventoryItem: async (
        quantity: number,
        consumableId: number
      ) => {
        set({isTechnicalLoading: true})
        try {
          const response = await API.updateVesselInventoryItem(
            quantity,
            consumableId
          )
          set({isTechnicalLoading: false})
          return response
        } catch (error) {
          set({isTechnicalLoading: false})
        }
      },
      getVesselRoutinesByCategory: async (
        vesselId: string,
        categoryKey: string
      ) => {
        set({isTechnicalLoading: true, routinesByCategory: []})
        try {
          const response = await API.reloadRoutinesByCategory(
            vesselId,
            categoryKey
          )

          if (Array.isArray(response)) {
            set({
              isTechnicalLoading: false,
              routinesByCategory: response,
            })
          } else {
            set({
              isTechnicalLoading: false,
              routinesByCategory: [],
            })
          }
        } catch (error) {
          set({isTechnicalLoading: false})
        }
      },
      getVesselRoutineDetails: async (id: string) => {
        set({isTechnicalLoading: true, routineDetails: []})
        try {
          const response = await API.reloadRoutineDetails(id)
          if (typeof response === 'object') {
            set({
              isTechnicalLoading: false,
              routineDetails: response,
            })
          } else {
            set({
              isTechnicalLoading: false,
              routineDetails: [],
            })
          }
        } catch (error) {
          set({isTechnicalLoading: false})
        }
      },
    }),
    {
      name: 'technical-storage',
      getStorage: () => AsyncStorage,
    }
  )
)
