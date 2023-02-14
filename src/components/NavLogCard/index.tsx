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
import {NavigationLog} from '@bluecentury/models'

export const NavLogCard = (props: {
  key: number
  index: number
  navigationLog: NavigationLog
  defineFirstAndLastIndex: any[]
  itemColor: string
}) => {
  const {t} = useTranslation()
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>()
  const {index, navigationLog, defineFirstAndLastIndex, itemColor} = props
  const key = index
  const currentItemType = defineFirstAndLastIndex.find(
    item => item.charter.id === navigationLog.charter.id
  )
  const currentItemIndex = defineFirstAndLastIndex.findIndex(
    item => item.charter.id === navigationLog.charter.id
  )
  const previousItemType = defineFirstAndLastIndex[currentItemIndex - 1]
  let displayLeftLine = false
  let displayRightLine = false
  if (
    currentItemIndex === 0 &&
    currentItemType?.charter.id &&
    key <= currentItemType.lastIndex
  ) {
    displayLeftLine = true
  }
  if (currentItemIndex !== 0) {
    if (key <= previousItemType.lastIndex) {
      displayLeftLine = true
      displayRightLine = true
    }
    if (key > previousItemType.lastIndex && currentItemIndex % 2 !== 0) {
      displayLeftLine = false
      displayRightLine = true
    }
    if (key >= previousItemType.lastIndex && currentItemIndex % 2 === 0) {
      displayLeftLine = true
      displayRightLine = false
    }
  }

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
      <Box
        flex={1}
        flexDirection={'row'}
        h={'100%'}
        justifyContent={'space-between'}
        px={ms(4)}
        w={ms(16)}
      >
        <Box
          borderColor={
            !displayLeftLine
              ? 'rgba(52, 52, 52, 0)'
              : currentItemIndex === 0
              ? currentItemType?.colour
              : previousItemType.lastIndex < key
              ? currentItemType?.colour
              : previousItemType.colour
          }
          mb={
            currentItemType?.lastIndex === key
              ? ms(-7)
              : currentItemIndex % 2 !== 0 && previousItemType.lastIndex === key
              ? 0
              : ms(-7)
          }
          mt={
            currentItemIndex % 2 === 0 && currentItemType?.firstIndex === key
              ? ms(0)
              : currentItemIndex !== 0 ||
                (currentItemIndex % 2 !== 0 &&
                  previousItemType?.firstIndex < key &&
                  previousItemType.lastIndex > key)
              ? ms(-7)
              : 0
          }
          borderRadius={5}
          borderWidth={2}
        />
        <Box
          borderColor={
            !displayRightLine
              ? 'rgba(52, 52, 52, 0)'
              : previousItemType.lastIndex < key && !displayLeftLine
              ? currentItemType?.colour
              : previousItemType.lastIndex < key && displayLeftLine
              ? previousItemType.colour
              : currentItemType?.colour
          }
          borderWidth={2}
          mb={currentItemType?.lastIndex === key ? ms(0) : ms(-7)}
          mt={currentItemType?.firstIndex === key ? ms(0) : ms(-7)}
        />
      </Box>
      <Box borderRadius={ms(5)} overflow="hidden" w={'95%'}>
        {/* Navlog Header */}
        <Box backgroundColor={itemColor} px={ms(16)} py={ms(10)}>
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
          // mt={-3}
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
    flexDirection: 'row',
  },
})
