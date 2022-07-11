import React, {useEffect, useState} from 'react'
import {RefreshControl} from 'react-native'
import {Box, Button, Flex, ScrollView, Text} from 'native-base'
import {ms} from 'react-native-size-matters'
import {Shadow} from 'react-native-shadow-2'
import {useNavigation} from '@react-navigation/native'

import {useEntity, useTechnical} from '@bluecentury/stores'
import {Colors} from '@bluecentury/styles'
import {LoadingIndicator} from '@bluecentury/components'
import {ReservoirLevel, BunkeringList} from '../../components'

const Bunkering = () => {
  const navigation = useNavigation()
  const {physicalVesselId, vesselId} = useEntity()
  const {
    bunkering,
    gasoilReserviors,
    getVesselBunkering,
    getVesselGasoilReservoirs
  } = useTechnical()

  const [pullRefresh, setPullRefresh] = useState(false)

  useEffect(() => {
    getVesselBunkering(vesselId)
    getVesselGasoilReservoirs(physicalVesselId)
  }, [])

  const onPullToReload = () => {
    setPullRefresh(true)
    getVesselBunkering(vesselId)
    getVesselGasoilReservoirs(physicalVesselId)
    setPullRefresh(false)
  }

  return (
    <Flex flex={1}>
      <ScrollView
        contentContainerStyle={{flexGrow: 1, paddingBottom: 110}}
        px={ms(12)}
        py={ms(20)}
        refreshControl={
          <RefreshControl onRefresh={onPullToReload} refreshing={pullRefresh} />
        }
      >
        <Text color={Colors.azure} fontSize={ms(20)} fontWeight="bold">
          Gasoil
        </Text>
        {/* Gasoil Card */}
        {gasoilReserviors?.length > 0 ? (
          <ReservoirLevel
            reservoir={gasoilReserviors}
            physicalVesselId={physicalVesselId}
          />
        ) : (
          <LoadingIndicator />
        )}
        <Text
          color={Colors.azure}
          fontSize={ms(20)}
          fontWeight="bold"
          mt={ms(20)}
          mb={ms(10)}
        >
          Bunkering
        </Text>
        {bunkering?.length > 0 ? (
          <BunkeringList bunkering={bunkering} />
        ) : (
          <LoadingIndicator />
        )}
      </ScrollView>
      {/* Add Bunkering Button */}
      <Box bg={Colors.white} position="absolute" left={0} right={0} bottom={0}>
        <Shadow
          distance={25}
          viewStyle={{
            width: '100%'
          }}
        >
          <Button
            m={ms(16)}
            bg={Colors.primary}
            onPress={() => navigation.navigate('NewBunkering')}
          >
            Add bunkering
          </Button>
        </Shadow>
      </Box>
    </Flex>
  )
}

export default Bunkering
