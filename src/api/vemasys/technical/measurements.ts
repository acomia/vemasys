import {API} from '../../apiService'
import {AxiosError, AxiosResponse} from 'axios'
import moment from 'moment-timezone'
import {useEntity} from '@bluecentury/stores'

export const createNewConsumptionMeasure = async (
  resId: string,
  value: string
) => {
  const newBrusselsDateTime = moment.tz('Europe/Brussels')
  const newConsumptionMeasureData = {
    vesselPart: {
      id: resId,
    },
    user: {
      id: useEntity.getState().user[0].id,
    },
    date: newBrusselsDateTime,
    value: value.toString(),
    total: value.toString(),
    type: null,
  }
  return API.post('consumption_measures', newConsumptionMeasureData)
    .then((response: AxiosResponse) => {
      if (response.data) {
        return response.data
      } else {
        throw new Error('Create consumption measures failed.')
      }
    })
    .catch((error: Error | AxiosError) =>
      console.error('Error: Create consumption measures data', error)
    )
}
