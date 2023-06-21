import {Entity} from './Entity'

export type EntityUser = {
  id: number
  startDate: string
  endDate: string
  hasEntityAccepted?: boolean
  hasUserAccepted?: boolean
  role: {
    id: number
    title: string
    permissions: Array<string>
  }
  user: {
    id: number
    firstname: string | null
    lastname: string | null
    icon: any
  }
  entity: Entity
}
