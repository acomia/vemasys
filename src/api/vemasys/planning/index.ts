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

const updateNavigationLogDatetimeFields = async (
  navLogId: string,
  dates: object
) => {
  return API.put(`navigation_logs/${navLogId}`, dates)
    .then(response => {
      if (response.data) {
        return response.data
      } else {
        throw new Error('Update navlog datetime failed.')
      }
    })
    .catch(error => {
      console.error('Error: Update navlog datetime data', error)
    })
}

const createNavlogComment = async (
  navlogId: string,
  comment: string,
  userId: string
) => {
  return API.post(`navigation_log_comments`, {
    description: comment,
    user: {
      id: userId
    },
    log: {
      id: navlogId
    }
  })
    .then(response => {
      if (response.data) {
        return response.data
      } else {
        throw new Error('Create navlog comment failed.')
      }
    })
    .catch(error => {
      console.error('Error: Create navlog comment data', error)
    })
}

export {
  reloadNavigationLogDetails,
  reloadNavigationLogActions,
  reloadNavigationLogCargoHolds,
  reloadNavigationLogComments,
  reloadNavigationLogDocuments,
  updateNavigationLogDatetimeFields,
  createNavlogComment
}
