import {PROD_URL} from '@vemasys/env'

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
export const ROLE_PERMISSION_USER_EDIT = 'ROLE_PERMISSION_USER_EDIT'
export const ROLE_PERMISSION_USER_VIEW = 'ROLE_PERMISSION_USER_VIEW'
export const ROLE_PERMISSION_USER_MANAGE = 'ROLE_PERMISSION_USER_MANAGE'
export const EXTERNAL_PEGEL_IMAGE_URL =
  'https://www.elwis.de/DE/dynamisch/gewaesserkunde/wasserstaende'

// Map constants
export const DEFAULT_LATITUDE = 50.503887
export const DEFAULT_LONGITUDE = 4.469936

// Planning constants
export const VESSEL_PART_CARGO_TYPE = 'Cargo'
export const planningTabs = [
  {key: 'planning', title: 'Planning'},
  {key: 'logbook', title: 'Logbook'},
]
export const planningDetailsTabs = [
  {key: 'details', title: 'Details'},
  {key: 'actions', title: 'Actions'},
  {key: 'cargoList', title: 'Cargo List'},
  {key: 'cargoHolds', title: 'Cargo Holds'},
  {key: 'documents', title: 'Documents'},
  {key: 'navlogmap', title: 'Nav Log'},
]

// Financial constants
export const financialTabs = [
  {key: 'overview', title: 'Overview'},
  {key: 'costs', title: 'Costs'},
  {key: 'revenue', title: 'Revenue'},
  {key: 'scan', title: 'Scan'},
]

export const incomingStatuses = [
  {label: 'New', value: 'new'},
  {label: 'Read', value: 'read'},
  {label: 'Accepted', value: 'accepted'},
  {label: 'On hold', value: 'on_hold'},
  {label: 'Paid', value: 'paid'},
  {label: 'Unpaid', value: 'unpaid'},
]

export const outgoingStatuses = [
  {label: 'Draft', value: 'draft'},
  {label: 'Sent', value: 'sent'},
  {label: 'Read', value: 'read'},
  {label: 'Payment confirmed', value: 'payment_confirmed'},
  {label: 'Unpaid', value: 'unpaid'},
]

// Charters constants
export const chartersTabs = [
  {key: 'charters', title: 'Charters'},
  {key: 'time_charters', title: 'Time Charters'},
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

export const UPDATE_CHARTER_SUCCESS = 'UPDATE_CHARTER_SUCCESS'
export const UPDATE_CHARTER_FAILED = 'UPDATE_CHARTER_FAILED'
export const UPLOAD_CHARTER_SIGNATURE_SUCCESS =
  'UPLOAD_CHARTER_SIGNATURE_SUCCESS'
export const UPLOAD_CHARTER_SIGNATURE_FAILED = 'UPLOAD_CHARTER_SIGNATURE_FAILED'

// Technical constants

export const ROLE_PERMISSION_TASK_MANAGE = 'ROLE_PERMISSION_TASK_MANAGE'

export const technicalTabs = [
  {key: 'bunkering', title: 'Bunkering'},
  {key: 'engines', title: 'Engines'},
  {key: 'reservoirs', title: 'Reservoirs'},
  {key: 'tasks', title: 'Tasks'},
  {key: 'routines', title: 'Routines'},
  {key: 'certificates', title: 'Certificates'},
  {key: 'inventory', title: 'Inventory'},
]

// Information constants
export const informationTabs = [
  {key: 'pegels', title: 'Pegels'},
  {key: 'rules', title: 'Rules'},
  {key: 'tickerOilPrices', title: 'Ticker Oil Prices'},
]

// Crew constants
export const crewTabs = [
  {key: 'me', title: 'Me'},
  {key: 'planning', title: 'Planning'},
]
export const VESSEL_CREW_PLANNING_ONBOARD = 'onboard'
