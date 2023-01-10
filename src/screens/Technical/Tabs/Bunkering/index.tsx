import React, {useEffect, useState} from 'react'
import {RefreshControl} from 'react-native'
import {Box, Button, Flex, ScrollView, Text} from 'native-base'
import {ms} from 'react-native-size-matters'
import {Shadow} from 'react-native-shadow-2'
import {useNavigation} from '@react-navigation/native'

import {useEntity, useTechnical} from '@bluecentury/stores'
import {Colors} from '@bluecentury/styles'
import {LoadingAnimated} from '@bluecentury/components'
import {ReservoirLevel, BunkeringList} from '../../components'
import {useTranslation} from 'react-i18next'

const Bunkering = () => {
  const {t} = useTranslation()
  const navigation = useNavigation()
  const {physicalVesselId, vesselId} = useEntity()
  const {
    bunkering,
    gasoilReserviors,
    getVesselBunkering,
    getVesselGasoilReservoirs,
  } = useTechnical()

  const [pullRefresh, setPullRefresh] = useState(false)

  useEffect(() => {
    getVesselBunkering(vesselId)
    getVesselGasoilReservoirs(physicalVesselId)
  }, [vesselId])

  const onPullToReload = () => {
    setPullRefresh(true)
    getVesselBunkering(vesselId)
    getVesselGasoilReservoirs(physicalVesselId)
    setPullRefresh(false)
  }

  return (
    <Flex flex="1">
      <ScrollView
        contentContainerStyle={{flexGrow: 1, paddingBottom: 110}}
        px={ms(12)}
        py={ms(20)}
        refreshControl={
          <RefreshControl onRefresh={onPullToReload} refreshing={pullRefresh} />
        }
        showsVerticalScrollIndicator={false}
      >
        <Text color={Colors.azure} fontSize={ms(20)} bold>
          {t('gasoil')}
        </Text>
        {/* Gasoil Card */}
        {gasoilReserviors?.length > 0 ? (
          <ReservoirLevel
            reservoir={gasoilReserviors}
            physicalVesselId={physicalVesselId}
          />
        ) : (
          <LoadingAnimated />
        )}
        <Text
          color={Colors.azure}
          fontSize={ms(20)}
          bold
          mt={ms(20)}
          mb={ms(10)}
        >
          {t('bunkering')}
        </Text>
        {bunkering?.length > 0 ? (
          <BunkeringList bunkering={bunkering} />
        ) : (
          <LoadingAnimated />
        )}
      </ScrollView>
      {/* Add Bunkering Button */}
      <Box bg={Colors.white} position="absolute" left={0} right={0} bottom={0}>
        <Shadow
          distance={25}
          viewStyle={{
            width: '100%',
          }}
        >
          <Button
            m={ms(16)}
            bg={Colors.primary}
            onPress={() => navigation.navigate('NewBunkering')}
          >
            {t('addBunkering')}
          </Button>
        </Shadow>
      </Box>
    </Flex>
  )
}

export default Bunkering
