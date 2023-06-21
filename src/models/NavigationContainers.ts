export type NavigationContainer = {
  adn: boolean
  customer: null
  grossWeight: number
  id: number
  identification: string
  isoType: string
  nettWeight: number
  tareWeight: number
  type: {
    id: number
    isoCode: string
    sizeType: string
    title: string
  }
}

export type CreateNavigationContainer = {
  type: {
    title: string
    isoCode: string
    sizeType: string
  }
  nbIn: number
  nbOut: number
  log: {
    type: string
    exploitationVessel: string
    location: string
    bookedETA: string
    plannedETA: string
    terminalApprovedDeparture: string
    captainDatetimeETA: string
    departureDatetime: string
    arrivalDatetime: string
    announcedDatetime: string
    fileGroup: string
    modificationDate: string
    modifiedByUser: string
    startActionDatetime: string
    endActionDatetime: string
    numberOfCones: number
    loadUponDeparture: string
    comments: string[]
    bulkCargo: {}[]
    standardContainerCargo: null[]
    loadedContainerCargo: string[]
    unloadedContainerCargo: string[]
    requirementResponses: string[]
  }
  createdAt: string
  creationDate: string
}
