import {Icons} from '@bluecentury/assets'
import {PROD_URL} from '@bluecentury/env'

// General
export const ENTITY_TYPE_EXPLOITATION_VESSEL = 'ExploitationVessel'
export const ENTITY_TYPE_EXPLOITATION_GROUP = 'ExploitationGroup'
export const ENTITY_TYPE_CUSTOMER_COMPANY = 'CustomerCompany'
export const ENTITY_TYPE_SUPPLIER_COMPANY = 'SupplierCompany'
export const ENTITY_TYPE_TERMINAL = 'Terminal'
export const ROLE_PERMISSION_NAVIGATION_LOG_ADD_COMMENT =
  'ROLE_PERMISSION_NAVIGATION_LOG_ADD_COMMENT'
export const ROLE_PERMISSION_NAVIGATION_LOG_ADD_FILE =
  'ROLE_PERMISSION_NAVIGATION_LOG_ADD_FILE'
export const VEMASYS_PRODUCTION_FILE_URL = `${PROD_URL}/upload/documents`
export const FILE_TYPE_PDF = 'application/pdf'
export const FILE_TYPE_JPEG = 'image/jpeg'

// Planning constants
export const planningTabs = [
  {key: 'planning', title: 'Planning'},
  {key: 'logbook', title: 'Logbook'}
]

export const planningDetailsTabs = [
  {key: 'details', title: 'Details'},
  {key: 'cargoList', title: 'Cargo List'},
  {key: 'cargoHolds', title: 'Cargo Holds'},
  {key: 'documents', title: 'Documents'}
]

// Charters constants
export const chartersTabs = [
  {key: 'charters', title: 'Charters'},
  {key: 'time_charters', title: 'Time Charters'}
]
export const CHARTER_CONTRACTOR_STATUS_NEW = 'new'
export const CHARTER_CONTRACTOR_STATUS_ACCEPTED = 'accepted'
export const CHARTER_CONTRACTOR_STATUS_REFUSED = 'refused'
export const CHARTER_CONTRACTOR_STATUS_ARCHIVED = 'archived'

export const CHARTER_ORDERER_STATUS_DRAFT = 'draft'
export const CHARTER_ORDERER_STATUS_SUBMITTED = 'submitted'
export const CHARTER_ORDERER_STATUS_EN_ROUTE = 'en_route'
export const CHARTER_ORDERER_STATUS_COMPLETED = 'completed'
export const CHARTER_ORDERER_STATUS_ARCHIVED = 'archived'

// Technical constants

export const ROLE_PERMISSION_TASK_MANAGE = 'ROLE_PERMISSION_TASK_MANAGE'

export const technicalTabs = [
  {key: 'bunkering', title: 'Bunkering'},
  {key: 'engines', title: 'Engines'},
  {key: 'reservoirs', title: 'Reservoirs'},
  {key: 'tasks', title: 'Tasks'},
  {key: 'routines', title: 'Routines'},
  {key: 'certificates', title: 'Certificates'},
  {key: 'inventory', title: 'Inventory'}
]
