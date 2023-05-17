import {ExploitationGroup} from './ExploitationGroup'
import {ExploitationVessel} from './ExploitationVessel'

export type Entity = {
  id: number
  name: string
  alias: string
  icon: {
    path: string
  }
  exploitationGroup: null | ExploitationGroup
  exploitationVessel:
    | null
    | (ExploitationVessel & {
        entity: string
      })
  type: {
    id: number
    title: string
  }
  fileGroup: {
    id: number
  }
  hasLinkedUser: boolean
}

// {
//   "id": 238,
//   "alias": "Cortina",
//   "icon": {
//       "path": "ceade588-f3d5-4c14-a92b-82af115f1049.png"
//   },
//   "exploitationGroup": null,
//   "exploitationVessel": "/api/exploitation_vessels/109",
//   "type": {
//       "id": 3,
//       "title": "ExploitationVessel"
//   },
//   "fileGroup": {
//       "id": 1046
//   }
// }
