import React from 'react'
import {StyleSheet, TouchableOpacity} from 'react-native'
import {Box, Text, Image} from 'native-base'
import {ms} from 'react-native-size-matters'
import moment from 'moment'
import {useNavigation} from '@react-navigation/native'
import {Animated} from '@bluecentury/assets'
import {formatLocationLabel} from '@bluecentury/constants'
import {NativeStackNavigationProp} from '@react-navigation/native-stack/lib/typescript/src/types'

interface Props {
  logs: Array<any>
}

export const PlannedNavLogInfo = ({logs}: Props) => {
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
              title: formatLocationLabel(navigationLog?.location)
            })
      }
    >
      <Box ml={ms(15)}>
        {navigationLog === undefined ? (
          <Text fontWeight="700" color="#ADADAD">
            No upcoming plan yet
          </Text>
        ) : (
          <>
            <Text fontWeight="700">
              To: {formatLocationLabel(navigationLog?.location)}
            </Text>
            <Text color="#ADADAD">
              Planned:{' '}
              {moment(navigationLog?.plannedEta).format('DD MMM YYYY | HH:mm')}
            </Text>
          </>
        )}
      </Box>
      {navigationLog === undefined ? null : (
        <>
          <Box
            position="absolute"
            left={ms(-20)}
            width={ms(40)}
            height={ms(40)}
            borderRadius={ms(20)}
            backgroundColor="#F0F0F0"
            alignItems="center"
            justifyContent="center"
            zIndex={1}
          >
            <Image
              alt="planned-nav-log-img"
              source={Animated.nav_unloading}
              width={ms(30)}
              height={ms(30)}
              resizeMode="contain"
            />
          </Box>
          <Box
            position="absolute"
            top={ms(-35)}
            width={ms(2)}
            height={ms(50)}
            backgroundColor="#23475C"
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
    marginBottom: 20
  }
})
