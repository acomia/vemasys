import {API} from '../../apiService'
import {useEntity} from '@bluecentury/stores'
import {Vemasys} from '@bluecentury/helpers'

export const createNewConsumptionMeasure = async (
  resId: string,
  value: string
) => {
  try {
    // Create new time in Brussels timezone & pass it
    const newBrusselsDateTime = Vemasys.defaultDatetime()
    const newMeasureData = {
      vesselPart: {id: resId},
      user: {id: useEntity.getState().user?.id},
      date: newBrusselsDateTime,
      value: value.toString(),
      total: value.toString(),
      type: null,
    }
    const response = await API.post('consumption_measures', newMeasureData)
    return response.data
  } catch (error) {
    console.log('Error createNewConsumptionMeasure', error)
    return null
  }
}
