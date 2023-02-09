import React from 'react'
import {StyleSheet, TouchableOpacity} from 'react-native'
import _ from 'lodash'
import {
  calculateTotalIn,
  calculateTotalOut,
  formatLocationLabel,
} from '@bluecentury/constants'
import {Box, HStack, Image, Text} from 'native-base'
import {ms} from 'react-native-size-matters'
import {Colors} from '@bluecentury/styles'
import moment from 'moment/moment'
import {Icons} from '@bluecentury/assets'
import {NavigationLogType} from '@bluecentury/components'
import {useNavigation} from '@react-navigation/native'
import {NativeStackNavigationProp} from '@react-navigation/native-stack'
import {RootStackParamList} from '@bluecentury/types/nav.types'
import {useTranslation} from 'react-i18next'

export const NavLogCard = ({navigationLog}: any) => {
  const {t} = useTranslation()
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>()
  return (
    <TouchableOpacity
      key={navigationLog.id}
      style={[
        styles.navLogItemWrapper,
        navigationLog.isActive ||
        (!_.isNull(navigationLog.startActionDatetime) &&
          _.isNull(navigationLog.endActionDate))
          ? styles.navLogActiveItem
          : null,
      ]}
      activeOpacity={0.7}
      onPress={() =>
        navigation.navigate('PlanningDetails', {
          navlog: navigationLog,
          title: formatLocationLabel(navigationLog?.location) as string,
        })
      }
    >
      <Box borderRadius={ms(5)} overflow="hidden">
        {/* Navlog Header */}
        <Box backgroundColor={Colors.border} px={ms(16)} py={ms(10)}>
          <Text bold color={Colors.text} fontSize={ms(15)}>
            {formatLocationLabel(navigationLog?.location)}
          </Text>
          <Text color={Colors.azure} fontWeight="medium">
            {t('planned')}
            {moment(navigationLog?.plannedEta).format('DD MMM YYYY | HH:mm')}
          </Text>
        </Box>
        {/* End of Header */}

        <Box
          borderWidth={
            navigationLog.isActive ||
            (!_.isNull(navigationLog.startActionDatetime) &&
              _.isNull(navigationLog.endActionDate))
              ? null
              : 3
          }
          borderColor={Colors.border}
          borderStyle="dashed"
          mt={-3}
          pt={3}
          px={ms(14)}
          py={ms(10)}
        >
          <HStack alignItems="center" mt={ms(5)}>
            <Box flex="1">
              {navigationLog?.bulkCargo.length > 0 &&
                navigationLog?.bulkCargo.map((cargo: any, i: number) => {
                  return (
                    <HStack key={i} alignItems="center" mr={ms(5)}>
                      <Text bold color={Colors.disabled}>
                        {`(${Math.ceil(cargo.tonnage)} MT) `}
                      </Text>
                      <Text
                        bold
                        color={Colors.highlighted_text}
                        ellipsizeMode="tail"
                        flex="1"
                        numberOfLines={1}
                      >
                        {/* ${Math.ceil(cargo.actualTonnage)} MT -  */}
                        {` ${
                          cargo.type.nameEn !== null ||
                          cargo.type.nameNl !== null
                            ? cargo.type.nameEn || cargo.type.nameNl
                            : t('unknown')
                        }`}
                      </Text>
                      <Image
                        alt="navlogs-tags"
                        mx={ms(5)}
                        resizeMode="contain"
                        source={Icons.tags}
                      />
                    </HStack>
                  )
                })}
              <HStack alignItems="center" mt={ms(5)}>
                <Text bold color={Colors.highlighted_text}>
                  {calculateTotalOut(navigationLog)} MT
                </Text>
                <Image
                  alt="triple-arrow-navlogs"
                  mx={ms(5)}
                  resizeMode="contain"
                  source={Icons.triple_arrow}
                />
                <Text bold color={Colors.highlighted_text}>
                  {calculateTotalIn(navigationLog)} MT
                </Text>
              </HStack>
            </Box>
            <Box alignItems="center">
              <NavigationLogType navigationLog={navigationLog} />
              {navigationLog.actionType === 'Cleaning' ? null : (
                <Text bold color={Colors.azure} fontSize={ms(15)} mt={ms(5)}>
                  {Math.ceil(navigationLog?.bulkCargo[0]?.actualTonnage)} MT
                </Text>
              )}
            </Box>
          </HStack>
        </Box>
      </Box>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  navLogActiveItem: {
    borderColor: Colors.secondary,
    borderWidth: 3,
    borderRadius: ms(8),
  },
  navLogItemWrapper: {
    marginBottom: 14,
  },
})
