import moment from 'moment'
import {API} from '../../apiService'
import {ENTITY_TYPE_SUPPLIER_COMPANY} from '@bluecentury/constants'
import {useAuth, useEntity} from '@bluecentury/stores'
import {PROD_URL} from '@bluecentury/env'

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
        throw new Error('Vessel engines failed.')
      }
    })
    .catch(error => console.error('Error: Vessel engines fetching data', error))
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

const reloadVesselReservoirs = async (physicalVesselId: string) => {
  return API.get(`reservoirs?physicalVesselId=${physicalVesselId}`)
    .then(response => {
      if (response.data) {
        return response.data
      } else {
        throw new Error('Vessel reservoirs failed.')
      }
    })
    .catch(error => console.error('Error: Vessel reservoirs data', error))
}

const reloadTasksCategory = async (vesselId: string) => {
  return API.get(`tasks/sections?exploitationVesselId=${vesselId}`)
    .then(response => {
      if (response.data) {
        return response.data
      } else {
        throw new Error('Vessel tasks category failed.')
      }
    })
    .catch(error => console.error('Error: Vessel tasks category data', error))
}

const reloadTasksByCategory = async (vesselId: string, categoryKey: string) => {
  return API.get(
    `tasks/sections/${categoryKey}?exploitationVesselId=${vesselId}`
  )
    .then(response => {
      if (response.data) {
        return response.data
      } else {
        throw new Error('Vessel tasks by category failed.')
      }
    })
    .catch(error =>
      console.error('Error: Vessel tasks by category data', error)
    )
}

const createTaskComment = async (taskId: string, comment: string) => {
  return API.put(`tasks/${taskId}`, {
    comments: [
      {
        description: comment,
        creationDate: new Date()
      }
    ]
  })
    .then(response => {
      if (response.data) {
        return response.data
      } else {
        throw new Error('Vessel tasks create comment failed.')
      }
    })
    .catch(error =>
      console.error('Error: Vessel tasks create comment data', error)
    )
}

const deleteVesselTask = async (taskId: string) => {
  return API.delete(`tasks/${taskId}`)
    .then(response => {
      if (response.data) {
        return response.data
      } else {
        throw new Error('Vessel delete task failed.')
      }
    })
    .catch(error => console.error('Error: Vessel delete task data', error))
}

const uploadTaskImageFile = async (
  subject: string,
  file: ImageFile,
  accessLevel: string,
  id: number
) => {
  const formData = new FormData()
  const image = {
    uri: file.uri,
    type: file.type,
    name: file.fileName || `IMG_${Date.now()}`
  }
  formData.append('file', image)
  formData.append('access-level', accessLevel)
  API.setBaseURL(`${PROD_URL}/api/`)
  return API.post(`v2/files/${subject}/${id}`, formData)
    .then(response => {
      if (response.data) {
        return response.data
      } else {
        throw new Error('Vessel task upload image failed.')
      }
    })
    .catch(error =>
      console.error('Error: Vessel task upload image data', error)
    )
}

const createVesselTask = async (task: Task) => {
  return API.post(`tasks`, task)
    .then(response => {
      if (response.data) {
        return response.data
      } else {
        throw new Error('Add vessel task failed.')
      }
    })
    .catch(error => console.error('Error: Add vessel task data', error))
}

const updateVesselTask = async (taskId: string, task: Task) => {
  return API.put(`tasks/${taskId}`, task)
    .then(response => {
      if (response.data) {
        return response.data
      } else {
        throw new Error('Update vessel task failed.')
      }
    })
    .catch(error => console.error('Error: Update vessel task data', error))
}

const reloadRoutines = async (vesselId: string) => {
  return API.get(
    `v3/maintenance_routines/sections?exploitationVesselId=${vesselId}`
  )
    .then(response => {
      if (response.data) {
        return response.data
      } else {
        throw new Error('Vessel routines category failed.')
      }
    })
    .catch(error =>
      console.error('Error: Vessel routines category data', error)
    )
}

const reloadCertificates = async (vesselId: string) => {
  return API.get(`certificates?exploitationVessel.id=${vesselId}`)
    .then(response => {
      if (response.data) {
        return response.data
      } else {
        throw new Error('Vessel certificates failed.')
      }
    })
    .catch(error => console.error('Error: Vessel certificates data', error))
}

export {
  reloadVesselBunkering,
  reloadVesselGasoilReservoirs,
  reloadVesselBunkeringSuppliers,
  createVesselBunkering,
  reloadVesselEngines,
  reloadVesselPartLastMeasurements,
  reloadVesselReservoirs,
  reloadTasksCategory,
  reloadTasksByCategory,
  createTaskComment,
  deleteVesselTask,
  uploadTaskImageFile,
  createVesselTask,
  updateVesselTask,
  reloadRoutines,
  reloadCertificates
}
