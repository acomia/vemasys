import moment from 'moment'
import {API} from '../../apiService'
import {ENTITY_TYPE_SUPPLIER_COMPANY} from '@bluecentury/constants'
import {useAuth, useEntity} from '@bluecentury/stores'

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

const reloadVesselBunkeringSuppliers = async () => {
  return API.get(`entities?type.title=${ENTITY_TYPE_SUPPLIER_COMPANY}`)
    .then(response => {
      if (response.data) {
        return response.data
      } else {
        throw new Error('Bunkering suppliers failed.')
      }
    })
    .catch(error => {
      console.error('Error: Bunkering suppliers fetching data', error)
    })
}

const createVesselBunkering = async (bunkering: any) => {
  return API.post(`consumption_bunkerings`, {
    value: parseInt(bunkering.amount ? bunkering.amount : 0),
    entity: {
      id: bunkering.bunkeringId
    },
    date: moment(bunkering.date).format(),
    user: {
      id: useEntity.getState().user.id
    },
    exploitationVessel: {
      id: useEntity.getState().vesselId
    },
    description: bunkering.description,
    // Create an empty fileGroup so we can upload files in the future
    fileGroup: {
      objectType: null
    }
  })
    .then(response => {
      if (response.data) {
        return response.data
      } else {
        throw new Error('Bunkering suppliers failed.')
      }
    })
    .catch(error => {
      console.error('Error: Bunkering suppliers fetching data', error)
    })
}

const reloadVesselEngines = async (physicalVesselId: string) => {
  return API.get(
    `vessel_parts?isMeasurable=1&deletedAt[exists]=false&vesselZone.physicalVessel.id=${physicalVesselId}`
  )
    .then(response => {
      if (response.data) {
        return response.data
      } else {
        throw new Error('Bunkering suppliers failed.')
      }
    })
    .catch(error => console.error('Error: Engines fetching data', error))
}

const reloadVesselPartLastMeasurements = async (partId: string) => {
  const ITEMS_PER_PAGE = 5
  return API.get(
    `consumption_measures?vesselPart.id=${partId}&itemsPerPage=${ITEMS_PER_PAGE}`
  )
    .then(response => {
      if (response.data) {
        return response.data
      } else {
        throw new Error('Veseel part last measurements failed.')
      }
    })
    .catch(error =>
      console.error('Error: Veseel part last measurements fetching data', error)
    )
}

export {
  reloadVesselBunkering,
  reloadVesselGasoilReservoirs,
  reloadVesselBunkeringSuppliers,
  createVesselBunkering,
  reloadVesselEngines,
  reloadVesselPartLastMeasurements
}
