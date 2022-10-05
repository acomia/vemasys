import {API} from '@bluecentury/api/apiService'
import moment from 'moment'

const reloadVesselPegels = async (name: string) => {
  return API.get(`stream_gauges/by_river?name=${name}`)
    .then(response => {
      if (response.data) {
        return response.data
      } else {
        throw new Error('Vessel pegels failed.')
      }
    })
    .catch(error => {
      console.error('Error: Vessel pegels data', error)
    })
}
const reloadVesselRules = async (vesselId: string, name: string) => {
  return API.get(`zone_rules?name=${name}`)
    .then(async response => {
      if (response.data) {
        let res = await API.get(
          `vessel_rule_exploitation_vessels?exploitationVessel.id=${vesselId}&vesselRule.defaultName=${name}`
        )
        console.log('Eploit', res.data)
        // res?.data?.map(vr => {
        //   return {
        //     id: vr.id,
        //     name: vr.vesselRule.defaultName,
        //     startApplicationDate: vr.startApplicationDate,
        //     fileGroup: vr.vesselRule.fileGroup
        //   }
        // })
        return response.data
      } else {
        throw new Error('Vessel rules failed.')
      }
    })
    .catch(error => {
      console.error('Error: Vessel rules data', error)
    })
}
const reloadVesselTickerOilPrices = async () => {
  return API.get(`ticker_oil_prices?order[date]`)
    .then(response => {
      if (response.data) {
        return response.data
      } else {
        throw new Error('Vessel ticker oil prices failed.')
      }
    })
    .catch(error => {
      console.error('Error: Vessel ticker oil prices data', error)
    })
}

const reloadPegelDetails = async (pegelId: number) => {
  const oneWeekBeforeNow = moment()
    .hours(0)
    .minutes(0)
    .seconds(0)
    .subtract(7, 'days')
  return API.get(
    `stream_gauge_measurements?streamGauge.id=${pegelId}&measureTime[after]=${oneWeekBeforeNow.toISOString()}`
  )
    .then(response => {
      if (response.data) {
        return response.data
      } else {
        throw new Error('Vessel ticker oil prices failed.')
      }
    })
    .catch(error => {
      console.error('Error: Vessel ticker oil prices data', error)
    })
}

export {
  reloadVesselPegels,
  reloadVesselRules,
  reloadVesselTickerOilPrices,
  reloadPegelDetails
}
