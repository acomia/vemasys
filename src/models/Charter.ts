export type Charter = {
  id: number
  parent: string
  children: [string]
  clientReference: string
  vesselReference: string
  cargoType: string
  charterDate: Date
  ordererStatus: string
  contractorStatus: string
  exploitationVessel: {
    id: number
    entity: {
      id: number
      name: string
      alias: string
    }
    physicalVessel: {
      id: number
      euid: string
      mmsi: 0
    }
  }
  vesselContacts: [
    {
      id: number
      name: string
      email: string
      phoneNumber: string
    }
  ]
  additionalContacts: [
    {
      id: number
      charter: {}
      contact: {
        id: number
        name: string
        email: string
        phoneNumber: string
      }
    }
  ]
  navigationLogs: [
    {
      id: number
      status: {
        id: number
        title: string
      }
      location: {
        name: string
        locationName: string
      }
      bookedETA: Date
      plannedETA: Date
      terminalApprovedDeparture: Date
      captainDatetimeETA: Date
      departureDatetime: Date
      arrivalDatetime: Date
      announcedDatetime: Date
      estimatedTimeOfArrival: string
      startActionDatetime: Date
      estimatedEndActionDatetime: Date
      endActionDatetime: Date
      contacts: [
        {
          id: number
          name: string
          email: string
          phoneNumber: string
        }
      ]
      bulkCargo: [
        {
          id: number
          type: {
            id: number
            type: string
            adnListItem: {
              id: number
              unNumber: string
              labelNl: string
              labelEn: string
              class: string
              classificationCode: string
              packingGroup: string
            }
            hscode: string
            nameNL: string
            nameDE: string
            nameFR: string
            nameEN: string
            ntsCode: number
            ntsName: string
            euralCode: string
            bulkAttributes: [object]
          }
          amount: string
          actualAmount: string
          unit: string
          isLoading: false
          tonnage: number
          actualTonnage: 0
        }
      ]
      standardContainerCargo: [
        {
          id: number
          type: {
            id: number
            title: string
            isoCode: string
          }
          nbIn: number
          nbOut: number
          log: object
        }
      ]
      loadedContainerCargo: [string]
      unloadedContainerCargo: [string]
    }
  ]
  charterContracts: [
    {
      id: number
      delegated: true
      contract: {
        id: number
        contractType: string
        contractParties: [
          {
            id: number
            role: string
            status: string
            type: string
            reference: string
            creator: false
            description: string
            financialInformation: string
            entity: {
              id: number
              name: string
              alias: string
            }
          }
        ]
      }
      creator: string
      createdAt: Date
      updatedAt: Date
    }
  ]
  cargo: [
    {
      load: number
      isLoaded: true
    }
  ]
  customerReference: string
  isActive: true
  isCurrentlyActive: true
  supplierReference: string
  trackingUrl: string
  status: string
}
