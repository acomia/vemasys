import {Entity} from './Entity'

export type EntityUser = {
  id: number
  startDate: string
  endDate: string
  role: {
    id: number
    title: string
    permissions: Array<string>
  }
  user: string
  entity: Entity
}
