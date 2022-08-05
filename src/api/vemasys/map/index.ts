import {GeoPosition} from 'react-native-geolocation-service'
import {API} from '@bluecentury/api/apiService'
import {queryString} from '@bluecentury/utils'

const getPreviousNavLog = async (
  vesselId: string,
  itemsPerPage?: number,
  page?: number
) => {
  itemsPerPage = itemsPerPage || 5
  page = page || 1

  const params = {
    isCompleted: 1,
    // 'exists[plannedETA]': 1,
    // 'exists[departureDatetime]': 1,
    // 'order[plannedETA]': 'desc',
    exploitationVessel: vesselId,
    itemsPerPage: itemsPerPage || 5,
    page: page || 1
  }

  let stringParams = queryString(params)

  return API.get(`v3/navigation_logs${stringParams}`)
    .then(response => {
      if (response.data) {
        return response.data
      } else {
        throw new Error('Previous navigation logs failed.')
      }
    })
    .catch(error => {
      console.error('Error: Previous navigation logs', error)
    })
}

const reloadVesselHistoryNavLogs = async (vesselId: string, page: number) => {
  return API.get(
    `navigation_logs?exploitationVessel=${vesselId}&type=logbook&page=${page}`
  )
    .then(response => {
      if (response.data) {
        return response.data
      } else {
        throw new Error('History navigation logs failed.')
      }
    })
    .catch(error => {
      console.error('Error: History navigation logs', error)
    })
}

const getPlannedNavLog = async (vesselId: string) => {
  return API.get(`navigation_logs?exploitationVessel=${vesselId}&type=planned`)
    .then(response => {
      if (response.data) {
        return response.data
      } else {
        throw new Error('Planned navigation logs failed.')
      }
    })
    .catch(error => {
      console.error('Error: Planned navigation logs', error)
    })
}

const getCurrentNavLog = async (vesselId: string) => {
  return API.get(
    `v3/navigation_logs?exploitationVessel=${vesselId}&exists[departureDatetime]=false&exists[arrivalDatetime]=true`
  )
    .then(response => {
      if (response.data) {
        return response.data
      } else {
        throw new Error('Current navigation logs failed.')
      }
    })
    .catch(error => {
      console.error('Error: Current navigation logs', error)
    })
}

const getLastCompleteNavLogs = async (navLogId: string) => {
  return API.get(`v3/navigation_logs/${navLogId}/routes`)
    .then(response => {
      if (response.data) {
        return response.data
      } else {
        throw new Error('Last completed navigation logs failed.')
      }
    })
    .catch(error => {
      console.error('Error: Last completed navigation logs', error)
    })
}

const getActiveFormations = async () => {
  return API.get(`formations?exists[endedAt]=false`)
    .then(response => {
      if (response.data) {
        return response.data
      } else {
        throw new Error('Active formations failed.')
      }
    })
    .catch(error => {
      console.error('Error: Active formations', error)
    })
}

const verifyTrackingDeviceToken = async (
  id: string,
  token: string,
  method: string
) => {
  return API.get(`tracking_device/by-token?static_authenticator_token=${token}`)
    .then(response => {
      if (response.data) {
        return response.data
      } else {
        throw new Error('Active formations failed.')
      }
    })
    .catch(error => {
      console.error('Error: Active formations', error)
    })
}

const createVesselFormations = async (id: string, token: string) => {
  return API.post(`formations`, {
    masterExploitationVessel: `/api/exploitation_vessels/${id}`
  })
    .then(response => {
      if (response.data) {
        return response.data
      } else {
        throw new Error('Create formations failed.')
      }
    })
    .catch(error => {
      console.error('Error: Create formations', error)
    })
}

const addVesselToFormations = async (id: string, token: string) => {
  return API.put(`formations/${id}/add-vessel`, {
    staticAuthenticatorToken: token
  })
    .then(response => {
      if (response.data) {
        return response.data
      } else {
        throw new Error('Add Vessel formations failed.')
      }
    })
    .catch(error => {
      console.error('Error: Add Vessel formations', error)
    })
}

const removeVesselToFormations = async (
  formationId: string,
  vesselId: string
) => {
  return API.put(`formations/${formationId}/remove-vessel`, {
    exploitationVessel: `/api/exploitation_vessels/${vesselId}`
  })
    .then(response => {
      if (response.data) {
        return response.data
      } else {
        throw new Error('Remove Vessel formations failed.')
      }
    })
    .catch(error => {
      console.error('Error: Remove Vessel formations', error)
    })
}

const endVesselFormations = async (formationId: string, vesselId: string) => {
  return API.put(`formations/${formationId}/end`, {
    masterExploitationVessel: `/api/exploitation_vessels/${vesselId}`
  })
    .then(response => {
      if (response.data) {
        return response.data
      } else {
        throw new Error('End formations failed.')
      }
    })
    .catch(error => {
      console.error('Error: End formations', error)
    })
}

const getCurrentTrackerSource = async (vesselId: string) => {
  return API.get(`exploitation_vessels/${vesselId}`)
    .then(response => {
      if (response.data) {
        return response.data
      } else {
        throw new Error('Tracking source failed.')
      }
    })
    .catch(error => {
      console.error('Error: Tracking source', error)
    })
}

const sendCurrentPosition = async (position: GeoPosition) => {
  return API.post(`tracking_device/ingest_events/api_tracker`, {
    latitude: position?.coords?.latitude,
    longitude: position?.coords?.longitude,
    heading: position?.coords?.heading < 0 ? 1 : position?.coords?.heading,
    speed: position?.coords?.speed < 0 ? 1 : position?.coords?.speed
  })
    .then(response => {
      if (response.data) {
        return response.data
      } else {
        throw new Error('Tracking source failed.')
      }
    })
    .catch(error => {
      console.error('Error: Tracking source', error)
    })
}

export {
  getPreviousNavLog,
  reloadVesselHistoryNavLogs,
  getPlannedNavLog,
  getCurrentNavLog,
  getLastCompleteNavLogs,
  getActiveFormations,
  verifyTrackingDeviceToken,
  createVesselFormations,
  addVesselToFormations,
  removeVesselToFormations,
  endVesselFormations,
  getCurrentTrackerSource,
  sendCurrentPosition
}
