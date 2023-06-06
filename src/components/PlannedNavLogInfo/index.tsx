import React from 'react'
import {StyleSheet, TouchableOpacity} from 'react-native'
import {Box, Text, Image} from 'native-base'
import {ms} from 'react-native-size-matters'
import moment from 'moment'
import {useNavigation} from '@react-navigation/native'
import {Animated} from '@bluecentury/assets'
import {formatLocationLabel} from '@bluecentury/constants'
import {NativeStackNavigationProp} from '@react-navigation/native-stack/lib/typescript/src/types'
import {useTranslation} from 'react-i18next'

interface Props {
  logs: Array<any>
}

export const PlannedNavLogInfo = ({logs}: Props) => {
  const {t} = useTranslation()
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>()
  const navigationLog = logs?.find((plan: any) => plan.plannedEta !== null)

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() =>
        navigationLog === undefined
          ? null
          : navigation.navigate('PlanningDetails', {
              navlog: navigationLog,
              title: formatLocationLabel(navigationLog?.location),
            })
      }
    >
      <Box ml={ms(15)}>
        {navigationLog === undefined ? (
          <Text color="#ADADAD" fontWeight="700">
            {t('noUpcomingPlanYet')}
          </Text>
        ) : (
          <>
            <Text fontWeight="700">
              {t('to')}
              {formatLocationLabel(navigationLog?.location)}
            </Text>
            <Text color="#ADADAD">
              {t('planned')}
              {moment(navigationLog?.plannedEta).format('DD MMM YYYY | HH:mm')}
            </Text>
          </>
        )}
      </Box>
      {navigationLog === undefined ? null : (
        <>
          <Box
            alignItems="center"
            backgroundColor="#F0F0F0"
            borderRadius={ms(20)}
            height={ms(40)}
            justifyContent="center"
            left={ms(-20)}
            position="absolute"
            width={ms(40)}
            zIndex={1}
          >
            <Image
              alt="planned-nav-log-img"
              height={ms(30)}
              resizeMode="contain"
              source={Animated.nav_unloading}
              width={ms(30)}
            />
          </Box>
          <Box
            backgroundColor="#23475C"
            bottom={ms(-35)}
            height={ms(50)}
            position="absolute"
            width={ms(2)}
          />
        </>
      )}
    </TouchableOpacity>
  )
}
const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 5,
    borderWidth: 1.3,
    borderColor: '#BEE3F8',
    borderStyle: 'dashed',
    paddingVertical: 10,
    paddingHorizontal: 15,
    marginBottom: 20,
  },
})
