import {useEntity} from '@bluecentury/stores'
import {API} from '../../apiService'

const reloadVesselBunkering = async (vesselId: string) => {
  return API.get(`consumption_bunkerings?exploitationVessel.id=${vesselId}`)
    .then(response => {
      if (response.data) {
        return response.data
      } else {
        throw new Error('Bunkering failed.')
      }
    })
    .catch(error => {
      console.error('Error: Bunkering fetching data', error)
    })
}

const reloadVesselGasoilReservoirs = async (physicalVesselId: string) => {
  return API.get(
    `vessel_parts?vesselZone.physicalVessel.id=${physicalVesselId}&exists[deletedAt]=false&exists[position]=false&exists[positionType]=false`
  )
    .then(response => {
      if (response.data) {
        return response.data
      } else {
        throw new Error('Bunkering failed.')
      }
    })
    .catch(error => {
      console.error('Error: Bunkering fetching data', error)
    })
}

export {reloadVesselBunkering, reloadVesselGasoilReservoirs}
