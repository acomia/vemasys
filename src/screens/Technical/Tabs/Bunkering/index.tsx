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
    isTechnicalLoading,
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
        refreshControl={
          <RefreshControl refreshing={pullRefresh} onRefresh={onPullToReload} />
        }
        contentContainerStyle={{flexGrow: 1, paddingBottom: 110}}
        px={ms(12)}
        py={ms(20)}
        showsVerticalScrollIndicator={false}
      >
        <Text bold color={Colors.azure} fontSize={ms(20)}>
          {t('gasoil')}
        </Text>
        {/* Gasoil Card */}
        {gasoilReserviors?.length > 0 ? (
          <ReservoirLevel
            physicalVesselId={physicalVesselId}
            reservoir={gasoilReserviors}
          />
        ) : (
          <LoadingAnimated />
        )}
        <Text
          bold
          color={Colors.azure}
          fontSize={ms(20)}
          mb={ms(10)}
          mt={ms(20)}
        >
          {t('bunkering')}
        </Text>
        {bunkering?.length > 0 && !isTechnicalLoading ? (
          <BunkeringList bunkering={bunkering} />
        ) : (
          <LoadingAnimated />
        )}
      </ScrollView>
      {/* Add Bunkering Button */}
      <Box bg={Colors.white} bottom={0} left={0} position="absolute" right={0}>
        <Shadow
          viewStyle={{
            width: '100%',
          }}
          distance={25}
        >
          <Button
            bg={Colors.primary}
            m={ms(16)}
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
