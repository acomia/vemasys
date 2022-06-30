import {PROD_URL} from '@bluecentury/env'

export const ENTITY_TYPE_EXPLOITATION_VESSEL = 'ExploitationVessel'
export const ENTITY_TYPE_EXPLOITATION_GROUP = 'ExploitationGroup'
export const ENTITY_TYPE_CUSTOMER_COMPANY = 'CustomerCompany'
export const ENTITY_TYPE_SUPPLIER_COMPANY = 'SupplierCompany'
export const ENTITY_TYPE_TERMINAL = 'Terminal'
export const VEMASYS_PRODUCTION_FILE_URL = `${PROD_URL}/upload/documents`

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

export const technicalTabs = [
  {key: 'bunkering', title: 'Bunkering'},
  {key: 'engines', title: 'Engines'},
  {key: 'reservoirs', title: 'Reservoirs'},
  {key: 'tasks', title: 'Tasks'},
  {key: 'routines', title: 'Routines'},
  {key: 'certificates', title: 'Certificates'},
  {key: 'inventory', title: 'Inventory'}
]
