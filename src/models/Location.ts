import {Entity} from './Entity'

export type Location = {
  id: number
  averageStayDuration: NumberOrNull
  entity: Partial<Entity>
  latitude: number
  locationName: StringOrNull
  longitude: number
  moreInformation: StringOrNull
  name: StringOrNull
  openingInformations: StringOrNull
  owner: StringOrNull
  phoneNumber: StringOrNull
  riverHectoMeters: Array<any>
  type: {
    id: number
    title: StringOrNull
  }
}
