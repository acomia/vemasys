import {API} from '@bluecentury/api/apiService'

const getPreviousNavLog = async (vesselId: string) => {
  return API.get(
    `v3/navigation_logs?isCompleted=1&exists[plannedETA]=1&exists[departureDatetime]=1&order[plannedETA]=desc&exploitationVessel=${vesselId}`
  )
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

const getPlannedNavLog = async (vesselId: string) => {
  return API.get(
    `navigation_logs?isCompleted=0&exists[plannedETA]=1&itemsPerPage=1&order[plannedETA]=asc&exploitationVessel=${vesselId}`
  )
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
      console.log('last', response)

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

export {
  getPreviousNavLog,
  getPlannedNavLog,
  getCurrentNavLog,
  getLastCompleteNavLogs
}
