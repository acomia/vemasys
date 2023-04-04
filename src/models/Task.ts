export type Task = {
  id?: number
  children?: []
  watchers?: [
    {
      id: number
      startDate: Date
      endDate: Date
      hasEntityAccepted: boolean
      hasUserAccepted: boolean
      role: string
      user: {
        id: number
        firstname: string
        lastname: string
        professionalEmail: string
        birthday: Date
        gender: boolean
        address: string
        icon: {
          id: number
          path: string
          description: string
          uploadedTime: Date
          lastModification: Date
          type: object | null
        }
        identificationDocument: {
          id: number
          path: string
          description: string
          uploadedTime: Date
          lastModification: Date
          type: object | null
        }
        defaultLanguage: string
        fileGroup: {
          id: number
          files: [
            {
              id: number
              path: string
              description: string
              uploadedTime: Date
              lastModification: Date
              type: object | null
            }
          ]
        }
        certificateLevel: string
        entityUsers: []
        email: string
        language: string
      }
      entity: string
      deletedAt: Date
    }
  ]
  labels?: [
    {
      id: number
      type: string
      title: string
      color: string
      entity: string
    }
  ]
  title: string
  description: string
  instructions: string
  endTime?: Date
  dueHours?: number
  completedHours?: number
  fileGroup?: {
    id: number
    files: [
      {
        id: number
        path: string
        description: string
        uploadedTime: Date
        lastModification: Date
        type: object | null
      }
    ]
  }
  incidents?: [object | null]
  involvedVessel?: string
  vesselPart?: {
    id: number
    isReservoir: boolean
    vesselZone: string
    brand: {
      id: number
      title: string
    }
    name: string
    type: string
    position: number
    positionType: string
    deletedAt: Date
    volume: string
    capacity: string
    model: string
  }
  maintenanceRoutine?: {
    id: number
    labels: [
      {
        id: number
        type: string
        title: string
        color: string
        entity: string
      }
    ]
    datetime: Date
    description: string
    previousTotalHours: number
    title: string
  }
  comments?: [
    {
      id: number
      description: string
      creator: {
        id: number
        startDate: Date
        endDate: Date
        hasEntityAccepted: boolean
        hasUserAccepted: boolean
        role: string
        user: {
          id: number
          firstname: string
          lastname: string
          professionalEmail: string
          birthday: Date
          gender: boolean
          address: string
          icon: {
            id: number
            path: string
            description: string
            uploadedTime: Date
            lastModification: Date
            type: object | null
          }
          identificationDocument: {
            id: number
            path: string
            description: string
            uploadedTime: Date
            lastModification: Date
            type: object | null
          }
          defaultLanguage: string
          fileGroup: {
            id: number
            files: [
              {
                id: number
                path: string
                description: string
                uploadedTime: Date
                lastModification: Date
                type: object | null
              }
            ]
          }
          certificateLevel: string
          entityUsers: []
          email: string
          language: string
        }
        entity: string
        deletedAt: Date
      }
      createdAt: Date
      creationDate: Date
    }
  ]
  externalParty?: string
  flagged?: boolean
  deadline: Date
  status?: string
  instancedByMaintenanceRoutine?: boolean
  assignee?: object | null
  statusCode?: string
}
