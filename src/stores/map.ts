import create from 'zustand'
import {persist} from 'zustand/middleware'
import AsyncStorage from '@react-native-async-storage/async-storage'
import * as API from '@bluecentury/api/vemasys'
import {Coords} from 'react-native-background-geolocation'
import {GeographicPoint} from '@bluecentury/models'

interface LatLng {
  latitude: number
  longitude: number
}

type MapState = {
  vesselStatus: any
  prevNavLogs: Array<any>
  plannedNavLogs: Array<any>
  currentNavLogs: Array<any>
  lastCompleteNavLogs: Array<any>
  activeFormations: Array<any>
  vesselTracks: Array<any>
  isLoadingMap: boolean
  isLoadingVesselStatus: boolean
  isLoadingPreviousNavLogs: boolean
  isLoadingCurrentNavLogs: boolean
  isLoadingPlannedNavLogs: boolean
  isLoadingVesselTrack: boolean
  hasErrorLoadingPreviousNavLogs: boolean
  hasErrorLoadingCurrentNavLogs: boolean
  hasErrorLoadingPlannedNavLogs: boolean
  hasErrorLoadingVesselTrack: boolean
  tokenHasConnectedToShip: boolean
  isMobileTrackingEnable: boolean
  hasErrorLoadingNavigationLogs: boolean
  hasErrorLoadingVesselStatus: boolean
  trackViewMode: boolean
  isSearchLoading: boolean
  searchLocations: any[]
  isGeographicLoading: boolean
  geographicLocation: GeographicPoint | null
  isGeographicRoutesLoading: boolean
  geoGraphicRoutes: LatLng[]
  isGPSOpen: boolean
}

type MapActions = {
  getVesselStatus: (vesselId: string) => Promise<void>
  getPreviousNavigationLogs: (vesselId: string) => Promise<void>
  getPlannedNavigationLogs: (vesselId: string) => Promise<void>
  getCurrentNavigationLogs: (vesselId: string) => Promise<void>
  getLastCompleteNavigationLogs: (navLogId: string) => Promise<void>
  getActiveFormations: () => void
  verifyTrackingDeviceToken: (id: string, token: string, method: string) => void
  endVesselFormations: (formationId: string, vesselId: string) => void
  removeVesselFromFormations: (formationId: string, vesselId: string) => void
  sendCurrentPosition: (entityId: string, position: Coords) => void
  enableMobileTracking: () => void
  getVesselTrack: (vesselId: string, page: number) => void
  reset: () => void
  setTrackViewMode: (mode: boolean) => void
  unmountLocations: () => void
  getSearchLocations: (value: string) => void
  getDirections: (id: string) => void
  getGeographicPoints: (id: string) => void
  setGPSOpen: (isOpen: boolean) => void
}

type MapStore = MapState & MapActions

const initialMapState: MapState = {
  vesselStatus: undefined,
  prevNavLogs: [],
  plannedNavLogs: [],
  currentNavLogs: [],
  lastCompleteNavLogs: [],
  activeFormations: [],
  vesselTracks: [],
  isLoadingMap: false,
  isLoadingVesselStatus: false,
  isLoadingCurrentNavLogs: false,
  isLoadingPlannedNavLogs: false,
  isLoadingPreviousNavLogs: false,
  isLoadingVesselTrack: false,
  tokenHasConnectedToShip: false,
  isMobileTrackingEnable: false,
  hasErrorLoadingCurrentNavLogs: false,
  hasErrorLoadingPlannedNavLogs: false,
  hasErrorLoadingPreviousNavLogs: false,
  hasErrorLoadingNavigationLogs: false,
  hasErrorLoadingVesselStatus: false,
  hasErrorLoadingVesselTrack: false,
  trackViewMode: false,
  isSearchLoading: false,
  searchLocations: [],
  isGeographicLoading: false,
  geographicLocation: null,
  isGeographicRoutesLoading: false,
  geoGraphicRoutes: [],
  isGPSOpen: false,
}

export const useMap = create(
  persist<MapStore>(
    (set, get) => ({
      ...initialMapState,
      getPreviousNavigationLogs: async (vesselId: string) => {
        set({
          isLoadingPreviousNavLogs: true,
          hasErrorLoadingPreviousNavLogs: false,
        })
        try {
          const response: any = await API.getPreviousNavLog(vesselId)
          if (Array.isArray(response)) {
            set({
              prevNavLogs: response,
              isLoadingPreviousNavLogs: false,
            })
          } else {
            set({
              prevNavLogs: [],
              isLoadingPreviousNavLogs: false,
            })
          }
        } catch (error) {
          set({
            isLoadingPreviousNavLogs: false,
            hasErrorLoadingPreviousNavLogs: true,
          })
        }
      },
      getPlannedNavigationLogs: async (vesselId: string) => {
        set({
          isLoadingPlannedNavLogs: true,
          hasErrorLoadingPlannedNavLogs: false,
        })
        try {
          const response: any = await API.getPlannedNavLog(vesselId)
          if (Array.isArray(response)) {
            set({
              plannedNavLogs: response,
              isLoadingPlannedNavLogs: false,
            })
          } else {
            set({
              plannedNavLogs: [],
              isLoadingPlannedNavLogs: false,
            })
          }
        } catch (error) {
          set({
            isLoadingPlannedNavLogs: false,
            hasErrorLoadingPlannedNavLogs: true,
          })
        }
      },
      getCurrentNavigationLogs: async (vesselId: string) => {
        set({
          isLoadingCurrentNavLogs: true,
          hasErrorLoadingCurrentNavLogs: false,
        })
        try {
          const response: any = await API.getCurrentNavLog(vesselId)
          if (Array.isArray(response)) {
            set({
              currentNavLogs: response,
              isLoadingCurrentNavLogs: false,
            })
          } else {
            set({
              currentNavLogs: [],
              isLoadingCurrentNavLogs: false,
            })
          }
        } catch (error) {
          set({
            isLoadingCurrentNavLogs: false,
            hasErrorLoadingCurrentNavLogs: true,
          })
        }
      },
      getLastCompleteNavigationLogs: async (vesselId: string) => {
        set({
          isLoadingMap: true,
        })
        try {
          const response: any = await API.getLastCompleteNavLogs(vesselId)
          if (Array.isArray(response)) {
            const logs = response.reduce((prev, curr) => {
              if (prev.length === 0) return [...prev, curr]

              if (
                prev.findIndex(
                  value => value.location.name === curr.location.name
                ) !== -1
              ) {
                return [...prev]
              }

              return [...prev, curr]
            }, [])
            set({
              isLoadingMap: false,
              lastCompleteNavLogs: logs,
            })
          } else {
            set({
              isLoadingMap: false,
              lastCompleteNavLogs: [],
            })
          }
        } catch (error) {
          set({
            isLoadingMap: false,
          })
        }
      },
      getActiveFormations: async () => {
        try {
          const response = await API.getActiveFormations()
          if (Array.isArray(response)) {
            set({
              activeFormations: response,
            })
          } else {
            set({
              activeFormations: [],
            })
          }
        } catch (error) {}
      },
      verifyTrackingDeviceToken: async (
        id: string,
        token: string,
        method: string
      ) => {
        set({isLoadingMap: true})
        try {
          const response: any = await API.verifyTrackingDeviceToken(
            id,
            token,
            method
          )
          if (response[0].entity == null) {
            set({isLoadingMap: false, tokenHasConnectedToShip: false})
          } else {
            set({tokenHasConnectedToShip: true})
            if (method === 'create') {
              const response = await API.createVesselFormations(id, token)
              if (response) {
                set({isLoadingMap: false})
              }
            } else {
              const response = await API.addVesselToFormations(id, token)
              if (response) {
                set({isLoadingMap: false})
              }
            }
          }
        } catch (error) {
          set({isLoadingMap: false})
        }
      },
      sendCurrentPosition: async (entityId, position) => {
        try {
          set({isLoadingMap: true})
          const response: any = await API.sendCurrentPosition(
            entityId,
            position
          )
          console.log('response after sending location', response)
          if (response) {
            set({isLoadingMap: false})
          }
        } catch (error) {
          console.log('error ', error)
          set({isLoadingMap: false})
        }
      },
      endVesselFormations: async (formationId: string, vesselId: string) => {
        try {
          const response = await API.endVesselFormations(formationId, vesselId)
          console.log('end', response)
          set({isLoadingMap: false})
        } catch (error) {
          set({isLoadingMap: false})
        }
      },
      removeVesselFromFormations: async (
        formationId: string,
        vesselId: string
      ) => {
        try {
          const response = await API.removeVesselToFormations(
            formationId,
            vesselId
          )
          console.log('remove', response)
          set({isLoadingMap: false})
        } catch (error) {
          set({isLoadingMap: false})
        }
      },
      enableMobileTracking: () => {
        const isMobileTrackingEnable = get().isMobileTrackingEnable
        set({isMobileTrackingEnable: !isMobileTrackingEnable})
      },
      getVesselStatus: async (vesselId: string) => {
        set({
          isLoadingVesselStatus: true,
          hasErrorLoadingVesselStatus: false,
          isGeographicRoutesLoading: false,
        })
        try {
          const response: any = await API.getVesselStatus(vesselId)
          if (Array.isArray(response)) {
            set({
              vesselStatus: response[0],
              isLoadingVesselStatus: false,
            })
          } else {
            set({
              vesselStatus: undefined,
              isLoadingVesselStatus: false,
            })
          }
        } catch (error) {
          set({
            isLoadingVesselStatus: false,
            hasErrorLoadingVesselStatus: true,
          })
        }
      },
      getVesselTrack: async (vesselId: string, page: number) => {
        set({isLoadingVesselTrack: true, hasErrorLoadingVesselTrack: false})
        try {
          const response = await API.getVesselTrack(vesselId, page)
          if (Array.isArray(response)) {
            set({
              vesselTracks:
                page === 1 ? response : [...get().vesselTracks, ...response],
              isLoadingVesselTrack: false,
            })
          } else {
            set({
              vesselTracks: [],
              isLoadingVesselTrack: false,
            })
          }
        } catch (error) {
          set({
            isLoadingVesselTrack: false,
            hasErrorLoadingVesselTrack: true,
          })
        }
      },
      reset: () => {
        set({
          ...initialMapState,
        })
      },
      setTrackViewMode: (mode: boolean) => {
        set({
          trackViewMode: mode,
        })
      },
      unmountLocations: () => {
        set({searchLocations: [], geoGraphicRoutes: []})
      },
      getSearchLocations: async (value: string) => {
        set({
          isGeographicRoutesLoading: false,
          searchLocations: [],
          isSearchLoading: true,
        })

        try {
          const response = await API.searchMap(value)
          if (typeof response === 'object' && response?.results) {
            set({searchLocations: response.results})
          }
          set({isSearchLoading: false})
        } catch (error) {
          set({isSearchLoading: false})
        }
      },
      getDirections: async (id: string) => {
        set({isGeographicRoutesLoading: true, geoGraphicRoutes: []})

        try {
          const response = await API.getGeographicRoutes(id)

          if (response !== null) {
            if (response.routes && response.routes.length) {
              const coordinates = response.routes?.flatMap((route: any) =>
                route.waypoints?.map(({location}) => ({
                  latitude: location.latitude,
                  longitude: location.longitude,
                }))
              )

              set({geoGraphicRoutes: coordinates})
            }

            set({isGeographicRoutesLoading: false})
          }
        } catch (error) {
          console.log('Get Directions error', error)
          set({isGeographicRoutesLoading: false})
        }
      },
      getGeographicPoints: async (id: string) => {
        set({isGeographicLoading: true, geographicLocation: null})

        try {
          const response = await API.geographicPoints(id)
          if (response !== null) {
            set({isGeographicLoading: false, geographicLocation: response})
            return response
          }
          set({isGeographicLoading: false})

          return null
        } catch (error) {
          console.log('Get geographic points failed', error)
          set({isGeographicLoading: false})
          return null
        }
      },
      setGPSOpen: (isOpen: boolean) => {
        set({isGPSOpen: isOpen})
      },
    }),
    {
      name: 'map-storage',
      getStorage: () => AsyncStorage,
    }
  )
)
