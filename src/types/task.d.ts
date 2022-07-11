enum TaskState {
  TASK_STATUS_TODO = 'todo',
  TASK_STATUS_IN_PROGRESS = 'in_progress',
  TASK_STATUS_DONE = 'done'
}

type Task = {
  '@id'?: string
  assignee?: EntityUser
  children?: Task[]
  sections?: string[]
  comments?: Comment[]
  completedHours?: number
  deadline?: Date
  description?: string
  dueHours?: number
  endTime?: Date
  exploitationVessel?: ExploitationVessel
  externalParty?: any
  fileGroup?: FileGroup
  id?: string
  incident?: any
  instancedByMaintenanceRoutine?: boolean
  instructions?: string
  labels?: Label[]
  maintenanceRoutine?: MaintenanceRoutine
  parent?: Task
  status?: TaskState
  title: string
  vesselPart?: VesselPart
  watchers?: EntityUser[]
  statusCode?: string
}
