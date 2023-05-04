import {Entity} from './Entity'

interface LastGeolocation {
  dataTime: string
  heading: number
  id: number
  lastIterationTime: string
  latitude: number
  locationTime: string
  longitude: number
  sourceOfData: string
  speed: number
}

interface PhysicalVessel {
  id: number
  euid: string
  mmsi: number
  length: string
  width: string
  weight: string
  draught: string
}

export type Vessel = {
  entity: Entity
  id: number
  lastGeolocation: LastGeolocation
  physicalVessel: PhysicalVessel
}
