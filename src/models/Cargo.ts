type containerType = {
  id: number
  title: string
  isoCode: string
  sizeType: string
}

export type StandardContainerCargo = {
  id: number
  log: string
  nbIn: number
  nbOut: number
  type: containerType[]
}
