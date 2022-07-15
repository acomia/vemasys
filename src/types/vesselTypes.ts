export type VesselDetails = {
  entity: {
    exploitationVessel: StringOrNull // '/api/exploitation_vessels/6347'
    icon: {
      path: StringOrNull // '24359110-1ece-4432-8fe1-86d5b14926df.png'
    }
    id: NumberOrNull // 9209
  }
  id: NumberOrNull // 6347
  lastGeolocation: {
    dataTime: StringOrNull // '2022-07-05T13:23:59+02:00'
    heading: NumberOrNull //107
    id: NumberOrNull // 945324664
    lastIterationTime: StringOrNull // '2022-07-13T10:49:01+02:00'
    latitude: number // 50.13253
    locationTime: StringOrNull // '2022-07-05T13:23:59+02:00'
    longitude: number // 8.82322
    sourceOfData: StringOrNull // 'aishub'
    speed: NumberOrNull // 10.93
  }
  physicalVessel: {
    draught: StringOrNull
    id: NumberOrNull // 6428
    length: NumberOrNull
    weight: NumberOrNull
    width: NumberOrNull
  }
}
