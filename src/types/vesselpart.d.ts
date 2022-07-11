type VesselPart = {
  '@id'?: string
  capacity?: int
  id?: string
  isReservoir?: boolean
  measurements?: string[]
  name?: string
  part?: Part
  position?: number
  positionType?: string
  volume?: string
  transactions?: CargoHoldTransaction[]
  vesselZone?: VesselZone
  value?: number
  lastMeasurementDate?: string
  type?: PartType
}
