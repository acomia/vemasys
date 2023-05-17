export type Routine = {
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
  exploitationVessel: string
  vesselPart: {
    id: number
    isReservoir: true
    vesselZone: {
      id: number
      physicalVessel: string
      title: string
    }
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
  routineType: {
    id: number
    title: string
  }
  pulledMaintenanceRoutineTemplates: [
    {
      status: string
      id: number
      title: string
      dateTime: Date
    }
  ]
  pushedMaintenanceRoutineTemplates: [
    {
      status: string
      id: number
      title: string
      dateTime: Date
    }
  ]
  description: string
  instructions: string
  previousTotalHours: number
  title: string
  openTasks: [
    {
      id: number
      watchers: [string]
      labels: [
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
      endTime: Date
      dueHours: number
      completedHours: number
      incidents: [object]
      deadline: Date
      status: {
        id: number
        objectType: string
        globalEquivalent: object
        title: string
        code: string
      }
      assignee: object
    }
  ]
  scheduleLabel: string
}
