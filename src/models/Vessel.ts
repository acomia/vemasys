import {Entity} from './Entity'

export type Vessel = {
  entity: Entity
  id: number
  lastGeolocation: {
    dataTime: string
    heading: string
    id: number
    lastIterationTime: string
    latitude: number
    locationTime: string
    longitude: number
    sourceOfData: string
    speed: number
  }
  physicalVessel: {
    draught: string
    id: number
    length: number
    weight: number
    width: number
  }
}
