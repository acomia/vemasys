import {API} from '../../apiService'

const reloadNavigationLogDetails = async (navLogId: string) => {
  return API.get(`navigation_logs/${navLogId}`)
    .then(response => {
      if (response.data) {
        return response.data
      } else {
        throw new Error('Navigation log details failed.')
      }
    })
    .catch(error => {
      console.error('Error: Navigation log details fetching data', error)
    })
}

const reloadNavigationLogActions = async (navLogId: string) => {
  return API.get(`navigation_log_actions?navigationLog.id=${navLogId}`)
    .then(response => {
      if (response.data) {
        return response.data
      } else {
        throw new Error('Navigation log actions failed.')
      }
    })
    .catch(error => {
      console.error('Error: Navigation log actions fetching data', error)
    })
}
const reloadNavigationLogCargoHolds = async (physicalVesselId: string) => {
  return API.get(
    `vessel_parts?part.type.title=Cargo&vesselZone.physicalVessel.id=${physicalVesselId}`
  )
    .then(response => {
      if (response.data) {
        return response.data
      } else {
        throw new Error('Navigation log cargo failed.')
      }
    })
    .catch(error => {
      console.error('Error: Navigation log cargo fetching data', error)
    })
}
const reloadNavigationLogComments = async (navLogId: string) => {
  return API.get(`navigation_log_comments?log.id=${navLogId}`)
    .then(response => {
      if (response.data) {
        return response.data
      } else {
        throw new Error('Navigation log comments failed.')
      }
    })
    .catch(error => {
      console.error('Error: Navigation log comments fetching data', error)
    })
}
const reloadNavigationLogDocuments = async (navLogId: string) => {
  return API.get(`navigation_logs/${navLogId}/documents`)
    .then(response => {
      if (response.data) {
        return response.data
      } else {
        throw new Error('Navigation log documents failed.')
      }
    })
    .catch(error => {
      console.error('Error: Navigation log documents fetching data', error)
    })
}

export {
  reloadNavigationLogDetails,
  reloadNavigationLogActions,
  reloadNavigationLogCargoHolds,
  reloadNavigationLogComments,
  reloadNavigationLogDocuments
}
