import React, {useEffect} from 'react'
import {StyleSheet, Text, View} from 'react-native'

import {useEntity, useTechnical} from '@bluecentury/stores'

export const Bunkering = () => {
  const {physicalVesselId, vesselId} = useEntity()
  const {getVesselBunkering, getVesselGasoilReservoirs} = useTechnical()

  useEffect(() => {
    getVesselBunkering(vesselId)
    getVesselGasoilReservoirs(physicalVesselId)
  }, [])
  return (
    <View>
      <Text>Bunkering</Text>
    </View>
  )
}
