import moment from 'moment'
import {API} from '../../apiService'

const reloadCrew = async (vesselId: string) => {
  return API.get(`exploitation-vessel/${vesselId}/crew`)
    .then(response => {
      if (response.data) {
        return response.data
      } else {
        throw new Error('Crew planning failed.')
      }
    })
    .catch(error => {
      console.error('Error: Crew planning fetching data', error)
    })
}

const reloadCrewPlanning = async (vesselId: string) => {
  return API.get(
    `exploitation-vessel/${vesselId}/crewplanning?date=${moment(
      new Date()
    ).format('YYYY-MM-DD')}`
  )
    .then(response => {
      if (response.data) {
        return response.data
      } else {
        throw new Error('Crew planning failed.')
      }
    })
    .catch(error => {
      console.error('Error: Crew planning fetching data', error)
    })
}

export {reloadCrew, reloadCrewPlanning}
