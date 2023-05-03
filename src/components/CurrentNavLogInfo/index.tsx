import React from 'react'
import {StyleSheet, TouchableOpacity} from 'react-native'
import {Box, Text, Image, HStack} from 'native-base'
import {ms} from 'react-native-size-matters'
import moment from 'moment'
import {useNavigation} from '@react-navigation/native'
import {useTranslation} from 'react-i18next'

import {Animated} from '@bluecentury/assets'
import {useMap} from '@bluecentury/stores'
import {formatLocationLabel} from '@bluecentury/constants'
import IconFA5 from 'react-native-vector-icons/FontAwesome5'
import {Colors} from '@bluecentury/styles'

interface Props {
  tracking: boolean
}

export const CurrentNavLogInfo = ({tracking}: Props) => {
  const {t} = useTranslation()
  const navigation = useNavigation()
  const {currentNavLogs, prevNavLogs, vesselStatus}: any = useMap()

  const handleOnPressNavigation = () => {
    navigation.navigate('PlanningDetails', {
      navlog: currentNavLogs[currentNavLogs?.length - 1],
      title: currentNavLogs[currentNavLogs?.length - 1]?.location?.name,
    })
  }

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={handleOnPressNavigation}
    >
      <Box ml={ms(15)}>
        {vesselStatus?.speed > 1 ? (
          <Text fontWeight="700">
            {t('navigatingAt')}
            <Text color="#29B7EF">{vesselStatus?.speed} km/h</Text>
          </Text>
        ) : currentNavLogs?.length !== 0 &&
          currentNavLogs[currentNavLogs?.length - 1]?.arrivalDatetime !==
            null &&
          currentNavLogs[currentNavLogs?.length - 1]?.departureDatetime ===
            null ? (
          <>
            <Text fontWeight="700">
              {formatLocationLabel(
                currentNavLogs[currentNavLogs?.length - 1]?.location
              )}
            </Text>
            {tracking ? (
              <HStack alignItems="center" justifyItems={'center'} space={ms(5)}>
                <IconFA5
                  color={Colors.warning}
                  name="info-circle"
                  size={ms(15)}
                />
                <Text color="#ADADAD">
                  {t('arrival')}
                  {moment(
                    currentNavLogs[currentNavLogs?.length - 1]?.arrivalDatetime
                  ).format('DD MMM YYYY | HH:mm')}
                </Text>
              </HStack>
            ) : (
              <Text color="#ADADAD">
                {t('arrival')}
                {moment(
                  currentNavLogs[currentNavLogs?.length - 1]?.arrivalDatetime
                ).format('DD MMM YYYY | HH:mm')}
              </Text>
            )}
          </>
        ) : (
          <>
            <Text fontWeight="700">Unknown Location</Text>
            <Text color="#ADADAD">
              {t('lastSeen')}
              {moment(prevNavLogs[0]?.arrivalDatetime).format(
                'DD MMM YYYY | HH:mm'
              )}
            </Text>
          </>
        )}
      </Box>

      <Box
        alignItems="center"
        backgroundColor="#F0F0F0"
        borderRadius={ms(20)}
        height={ms(40)}
        justifyContent="center"
        left={ms(-20)}
        position="absolute"
        width={ms(40)}
      >
        <Image
          alt="current-nav-log-img"
          height={ms(30)}
          resizeMode="contain"
          source={Animated.nav_navigating}
          width={ms(30)}
        />
      </Box>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#BEE3F8',
    padding: 15,
    marginBottom: 20,
    zIndex: 1,
  },
})
