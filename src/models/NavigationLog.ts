import {BulkCargo} from './BulkCargo'
import {Comments} from './Comments'
import {Contacts} from './Contacts'
import {EntityUser} from './EntityUser'
import {ExploitationVessel} from './ExploitationVessel'
import {Location} from './Location'

export type NavigationLog = {
  id: number
  announcedDatetime: StringOrNull
  arrivalDatetime: StringOrNull
  arrivalZoneTwo: StringOrNull
  attributes: Array<any>
  bookedEta: StringOrNull
  bulkCargo: BulkCargo[]
  captainDatetimeEta: StringOrNull
  cargoType: StringOrNull
  charter: {
    id: NumberOrNull
  }
  comments: Comments[] | undefined
  contacts: Contacts[] | undefined
  departureDatetime: StringOrNull
  departureZoneTwo: StringOrNull
  endActionDatetime: StringOrNull
  estimatedTimeOfArrival: StringOrNull
  exploitationVessel: Partial<ExploitationVessel>
  fileGroup: FileGroup
  loadUponDeparture: StringOrNull
  loadedContainerCargo: []
  location: Location
  locked: false
  modificationDate: StringOrNull
  modifiedByUser: {
    address: StringOrNull
    birthday: StringOrNull
    defaultLanguage: StringOrNull
    email: StringOrNull
    entityUsers: Partial<EntityUser>
    fileGroup: FileGroup
    firstname: StringOrNull
    gender: boolean
    icon: {
      description: StringOrNull
      id: number
      path: StringOrNull
    }
    id: number
    language: StringOrNull
    lastname: StringOrNull
    professionalEmail: StringOrNull
  }
  numberOfCones: NumberOrNull
  plannedEta: StringOrNull
  requirementResponses: Array<any>
  requirements: Array<any>
  standardContainerCargo: Array<any>
  startActionDatetime: StringOrNull
  terminalApprovedDeparture: StringOrNull
  type: {
    id: number
    title: StringOrNull
  }
  unloadedContainerCargo: Array<any>
}