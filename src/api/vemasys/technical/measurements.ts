import {API} from '../../apiService'
import moment from 'moment-timezone'
import {useEntity} from '@bluecentury/stores'

export const createNewConsumptionMeasure = async (
  resId: string,
  value: string
) => {
  // Create new time in Brussels timezone & pass it
  const newBrusselsDateTime = moment.tz('Europe/Brussels')
  const newMeasureData = {
    vesselPart: {id: resId},
    user: {id: useEntity.getState().user[0].id},
    date: newBrusselsDateTime,
    value: value.toString(),
    total: value.toString(),
    type: null,
  }
  try {
    const response = await API.post('consumption_measures', newMeasureData)
    return response.data
  } catch (error) {
    console.error('Error: Create consumption measures data', error)
    return null
  }
}
