import {API} from '@bluecentury/api/apiService'
import {queryString} from '@bluecentury/utils'
import {Location} from 'react-native-background-geolocation'
import {useMap} from '@bluecentury/stores'

const getPreviousNavLog = async (
  vesselId: string,
  itemsPerPage?: number,
  page?: number
) => {
  itemsPerPage = itemsPerPage || 5
  page = page || 1
  console.log('VID', vesselId)
  const params = {
    isCompleted: 1,
    'exists[plannedETA]': 1,
    'exists[arrivalDatetime]': 1,
    'exists[departureDatetime]': 1,
    'order[plannedETA]': 'desc',
    exploitationVessel: vesselId,
    itemsPerPage: itemsPerPage || 5,
    page: page || 1,
  }

  const stringParams = queryString(params)

  return API.get(`v3/navigation_logs${stringParams}`)
    .then(response => {
      if (response.data) {
        return response.data
      } else {
        throw new Error('Previous navigation logs failed.')
      }
    })
    .catch(error => {
      console.log('Error: Previous navigation logs', error)
      return Promise.reject(error)
    })
}

const reloadVesselHistoryNavLogs = async (vesselId: string, page: number) => {
  return API.get(
    `navigation_logs?exploitationVessel=${vesselId}&type=logbook&page=${page}&itemsPerPage=3`
  )
    .then(response => {
      if (response.data) {
        return response.data
      } else {
        throw new Error('History navigation logs failed.')
      }
    })
    .catch(error => {
      console.log('whahahahaha')
      console.log('Error: History navigation logs', error)
      return Promise.reject(error)
    })
}

const reloadWholeVesselHistoryNavLogs = async (vesselId: string) => {
  return API.get(`navigation_logs?exploitationVessel=${vesselId}&type=logbook`)
    .then(response => {
      if (response.data) {
        return response.data
      } else {
        throw new Error('Whole history navigation logs failed.')
      }
    })
    .catch(error => {
      console.log('Error: Whole history navigation logs', error)
      return Promise.reject(error)
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
      console.log('Error: Planned navigation logs', error)
      return Promise.reject(error)
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
      console.log('Error: Current navigation logs', error)
      Promise.reject(error)
    })
}

const getLastCompleteNavLogs = async (vesselId: string) => {
  // return API.get(`v3/navigation_logs/${navLogId}/routes`) /* old app call */
  return API.get(
    `v3/navigation_logs?exploitationVessel=${vesselId}&itemsPerPage=10&exists[departureDatetime]=1&exists[plannedETA]=0&order[departureDatetime]=desc`
  )
    .then(response => {
      if (response.data) {
        return response.data
      } else {
        throw new Error('Last completed navigation logs failed.')
      }
    })
    .catch(error => {
      console.log('Error: Last completed navigation logs', error)
      return Promise.reject(error)
    })
}

const getActiveFormations = async () => {
  return API.get('formations?exists[endedAt]=false')
    .then(response => {
      if (response.data) {
        return response.data
      } else {
        throw new Error('Active formations failed.')
      }
    })
    .catch(error => {
      console.log('Error: Active formations', error)
      return Promise.reject(error)
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
  return API.post('formations', {
    masterExploitationVessel: `/api/exploitation_vessels/${id}`,
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
    staticAuthenticatorToken: token,
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
    exploitationVessel: `/api/exploitation_vessels/${vesselId}`,
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
    masterExploitationVessel: `/api/exploitation_vessels/${vesselId}`,
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

const sendCurrentPosition = async (entityId: string, position: Location) => {
  console.log('LOCATION_FROM_SEND_CURRENT_POSITION', position)
  return API.post('tracking_device/ingest_events/api_tracker', {
    entity: entityId,
    latitude: position?.latitude,
    longitude: position?.longitude,
    heading: 1,
    speed: position?.speed < 0 ? 1 : position?.speed,
  })
    .then(response => {
      if (response.data) {
        console.log(response.data)
        return response.data
      } else {
        throw new Error('Tracking source failed.')
      }
    })
    .catch(error => {
      console.error('Error: Tracking source', error)
    })
}

const getVesselStatus = async (vesselId: string) => {
  return API.get(
    `geolocations?itemsPerPage=1&exploitationVessel.id=${vesselId}`
  )
    .then(response => {
      if (response.data) {
        return response.data
      } else {
        throw new Error('Vessel status failed.')
      }
    })
    .catch(error => {
      console.log('Error: Vessel status', error)
      return Promise.reject(error)
    })
}

const getVesselTrack = async (vesselId: string, page: number) => {
  return API.get(
    `geolocations?itemsPerPage=30&page=${page}&exploitationVessel.id=${vesselId}`
  )
    .then(response => {
      if (response.data) {
        return response.data
      } else {
        throw new Error('Vessel status failed.')
      }
    })
    .catch(error => {
      console.log('Error: Vessel status', error)
      return Promise.reject(error)
    })
}

export const searchMap = (searchValue: string) => {
  return API.post('v2/search', {
    entity: 'GeographicPoint',
    query: searchValue,
  })
    .then(response => {
      if (response?.status === 200) {
        return response.data
      }
      return null
    })
    .catch(error => {
      console.log('Error: Search', error)
      return null
    })
}

export const geographicPoints = (id: string | number) => {
  return API.get(`v3/geographic_points/${id}`)
    .then(response => {
      if (response.status === 200) {
        return response.data
      }
      return null
    })
    .catch(error => {
      console.log('Error: Location', error)
      return null
    })
}

export const getGeographicRoutes = (id: string | number) => {
  return API.get(`v3/geographic_points/${id}/navigation`)
    .then(response => {
      if (response.status === 200) {
        return response.data
      }
      return null
    })
    .catch(error => {
      console.log(`geographic_points/${id}/navigation`, error)
      return null
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
  sendCurrentPosition,
  getVesselStatus,
  getVesselTrack,
  reloadWholeVesselHistoryNavLogs,
}
