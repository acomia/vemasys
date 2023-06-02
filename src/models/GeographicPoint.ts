export type GeographicPoint = {
  '@context': string
  '@id': string
  '@type': string
  id: number
  name: string
  moreInformation: string | null
  openingInformations: string
  longitude: number
  latitude: number
  owner: null
  entity: {
    '@id': string
    '@type': string
    id: number
    name: string
    alias: string
    icon: null
    type: {
      '@id': string
      '@type': string
      id: number
      title: string
    }
  }
  type: {
    '@id': string
    '@type': string
    id: number
    title: string
  }
  locationName: string
  averageStayDuration: number
  phoneNumber: null
  riverHectoMeters: any[]
}
