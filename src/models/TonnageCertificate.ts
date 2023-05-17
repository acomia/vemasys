export type TonnageCertifications = {
  id: number
  exploitationVessel: string
  vesselCategory: {
    id: number
    title: string
    length: number
  }
  tonnage: string
  draught: string
}
