import {ExploitationGroup} from './ExploitationGroup'
import {ExploitationVessel} from './ExploitationVessel'

export type Entity = {
  id: number
  name: string
  alias: string
  icon: {
    path: string
  }
  exploitationGroup: ExploitationGroup
  exploitationVessel: ExploitationVessel
  type: {
    id: number
    title: string
  }
  fileGroup: {
    id: number
  }
}
