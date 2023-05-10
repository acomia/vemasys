import {API} from '@bluecentury/api/apiService'
import {useEntity} from '@bluecentury/stores'

type UploadItem = {
  draught: number
  tonnage: number
}

const getTonnageCertification = async (id: string) => {
  return API.get(`tonnage_certifications?exploitationVessel.id=${id}`)
    .then(response => {
      if (response.data) {
        return response.data
      } else {
        throw Error('Tonnage certification Request Failed')
      }
    })
    .catch(error => {
      console.error('Error: Tonnage certification ', error)
    })
}

const postTonnageCertification = async (item: UploadItem) => {
  const exploitationVessel = useEntity.getState().vesselId
  return API.post(`tonnage_certifications`, {
    tonnage: item.tonnage.toString(),
    draught: item.draught.toString(),
    exploitationVessel: exploitationVessel,
  })
    .then(response => {
      if (response.data) {
        console.log('POST_RESPONSE', response.data)
        return response.data
      } else {
        throw Error('Tonnage certification post Request Failed')
      }
    })
    .catch(error => {
      console.error('Error: Tonnage certification post', JSON.stringify(error))
    })
}

const putTonnageCertification = async (item: UploadItem, id: number) => {
  const exploitationVessel = useEntity.getState().vesselId
  return API.put(`tonnage_certifications/${id}`, {
    tonnage: item.tonnage.toString(),
    draught: item.draught.toString(),
    exploitationVessel: exploitationVessel,
  })
    .then(response => {
      if (response.data) {
        console.log('PUT_RESPONSE', response.data)
        return response.data
      } else {
        throw Error('Tonnage certification put Request Failed')
      }
    })
    .catch(error => {
      console.error(
        'Error: Tonnage certification put',
        JSON.stringify(error)
      )
    })
}

const removeTonnageCertification = async (id: number) => {
  return API.delete(`tonnage_certifications/${id}`)
    .then(response => {
      console.log('REMOVE_RESPONSE', response)
      return response.data
    })
    .catch(error => {
      console.error(
        'Error: Tonnage certification remove',
        JSON.stringify(error)
      )
    })
}

export {
  getTonnageCertification,
  postTonnageCertification,
  putTonnageCertification,
  removeTonnageCertification,
}
