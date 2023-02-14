import { NavigationLog } from './NavigationLog'

type WaypointLocation = {
  id: number
  name: string
  longitude: number
  latitude: number
  type: {
    id: number
    title: string
  }
  locationName: string
}

type Waypoints = {
  location: WaypointLocation
  navigationLog: NavigationLog
  estimatedArrival: StringOrNull
}

type Location = {
  id: number
  latitude: number
  locationName: string
  longitude: number
  name: string
  type: {}
}

export type NavigationLogRoutes = {
  actualActionDuration: number
  actualActionEnd: StringOrNull
  actualActionStart: StringOrNull
  actualActionStartDiff: number
  actualArrival: StringOrNull
  actualArrivalDiff: StringOrNull
  actualDemurrageDuration: StringOrNull
  actualDemurrageEnd: StringOrNull
  actualDemurrageStart: StringOrNull
  actualDeparture: StringOrNull
  actualPortArrival: StringOrNull
  actualStayDuration: number
  actualWaitingAreaArrival: StringOrNull
  actualWaitingAreaDeparture: StringOrNull
  actualWaitingDuration: number
  announcedArrival: StringOrNull
  arrivalDiff: number
  bookedArrival: StringOrNull
  captainsEstimatedArrival: StringOrNull
  completionPercentage: number
  completionStatus: string
  estimatedActionDuration: StringOrNull
  estimatedActionEnd: StringOrNull
  estimatedActionStart: StringOrNull
  estimatedArrival: StringOrNull
  estimatedArrivalDiff: StringOrNull
  estimatedDemurrageDuration: StringOrNull
  estimatedDemurrageEnd: StringOrNull
  estimatedDemurrageStart: StringOrNull
  estimatedDeparture: StringOrNull
  isOnTime: boolean
  location: Location
  missingActionDuration: StringOrNull
  navigationLog: NavigationLog
  plannedArrival: StringOrNull
  plannedDeparture: StringOrNull
  remainingActionDuration: number
  remainingStayDuration: number
  remainingWaitingDuration: number
  terminalApprovedDeparture: StringOrNull
  totalActionDuration: number
  totalStayDuration: number
  totalWaitingDuration: number
}
