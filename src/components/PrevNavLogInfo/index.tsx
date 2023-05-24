import React from 'react'
import {StyleSheet, TouchableOpacity} from 'react-native'
import {Box, Text, Image, HStack} from 'native-base'
import {ms} from 'react-native-size-matters'
import moment from 'moment'
import {Icons} from '@bluecentury/assets'
import {Colors} from '@bluecentury/styles'
import {formatLocationLabel} from '@bluecentury/constants'
import {NativeStackNavigationProp} from '@react-navigation/native-stack'
import {useNavigation} from '@react-navigation/native'
import {useTranslation} from 'react-i18next'
import IconFA5 from 'react-native-vector-icons/FontAwesome5'

interface Props {
  logs: Array<any>
  tracking?: boolean
}

export const PreviousNavLogInfo = ({logs, tracking = false}: Props) => {
  const {t} = useTranslation()
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>()
  const navigationLog = logs?.find((prev: any) => prev.plannedEta !== null)

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
            {t('noPreviousTerminal')}
          </Text>
        ) : (
          <>
            <Text fontWeight="700">
              {t('from')}
              {formatLocationLabel(navigationLog?.location)}
            </Text>
            <Text color="#ADADAD">
              {t('arrived')}
              {moment(navigationLog?.arrivalDatetime).format(
                'DD MMM YYYY | HH:mm'
              )}
            </Text>
            {tracking ? (
              <>
                <HStack
                  alignItems="center"
                  justifyItems={'center'}
                  space={ms(5)}
                >
                  <IconFA5
                    color={Colors.warning}
                    name="info-circle"
                    size={ms(15)}
                  />
                  <Text color="#ADADAD" fontSize={ms(11)}>
                    {t('departureDate')}
                    {moment(navigationLog?.departureDatetime).format(
                      'DD MMM YYYY | HH:mm'
                    )}
                  </Text>
                </HStack>
              </>
            ) : (
              <Text color="#ADADAD" fontSize={ms(11)}>
                {t('departureDate')}
                {moment(navigationLog?.departureDatetime).format(
                  'DD MMM YYYY | HH:mm'
                )}
              </Text>
            )}
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
              alt="prev-nav-log-img"
              height={ms(30)}
              resizeMode="contain"
              source={Icons.completed}
              width={ms(30)}
            />
          </Box>
          <Box
            backgroundColor={Colors.azure}
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
    borderWidth: 1,
    borderColor: '#E0E0E0',
    paddingVertical: 10,
    paddingHorizontal: 15,
    marginBottom: 20,
  },
})
