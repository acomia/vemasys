import React, {useEffect, useState} from 'react'
import {RefreshControl, TouchableOpacity, View} from 'react-native'
import {Box, Center, HStack, Image, ScrollView, Text} from 'native-base'
import {ms} from 'react-native-size-matters'
import moment from 'moment'
import {useNavigation} from '@react-navigation/native'
import styled from 'styled-components'
import {Colors} from '@bluecentury/styles'
import {Icons} from '@bluecentury/assets'
import {useEntity, usePlanning} from '@bluecentury/stores'
import {
  calculateTotalIn,
  calculateTotalOut,
  formatLocationLabel,
} from '@bluecentury/constants'
import {LoadingAnimated, NavigationLogType} from '@bluecentury/components'

const PlanningLogbook = () => {
  const navigation = useNavigation()
  const {
    isPlanningLoading,
    plannedNavigationLogs,
    getVesselPlannedNavLogs,
    hasErrorLoadingPlannedNavigationLogs,
  }: any = usePlanning()
  const {vesselId} = useEntity()

  useEffect(() => {
    getVesselPlannedNavLogs(vesselId)
  }, [vesselId])

  plannedNavigationLogs.sort(
    (a: any, b: any) =>
      moment(a.arrivalDatetime || a.plannedEta || a.arrivalZoneTwo).valueOf() -
      moment(b.arrivalDatetime || b.plannedEta || b.arrivalZoneTwo).valueOf()
  )

  const NavLogCard = ({navigationLog}: any) => {
    return (
      <TouchableOpacity
        key={navigationLog.id}
        activeOpacity={0.7}
        style={{marginBottom: 14}}
        onPress={() =>
          navigation.navigate('PlanningDetails', {
            navlog: navigationLog,
            title: formatLocationLabel(navigationLog?.location),
          })
        }
      >
        <Box borderRadius={ms(5)} overflow="hidden">
          {/* Navlog Header */}
          <Box backgroundColor={Colors.border} px={ms(16)} py={ms(10)}>
            <Text color={Colors.text} fontSize={ms(15)} bold>
              {formatLocationLabel(navigationLog?.location)}
            </Text>
            <Text color={'#23475C'} fontWeight="medium">
              Planned:{' '}
              {moment(navigationLog?.plannedEta).format(
                'DD MMM YYYY | hh:mm A'
              )}
            </Text>
          </Box>
          {/* End of Header */}

          <Box
            px={ms(14)}
            py={ms(10)}
            pt={3}
            borderWidth={3}
            borderColor={Colors.border}
            borderStyle="dashed"
            mt={-3}
          >
            <HStack alignItems="center" mt={ms(5)}>
              <Box flex="1">
                {navigationLog?.bulkCargo.length > 0 &&
                  navigationLog?.bulkCargo.map((cargo: any, i: number) => {
                    return (
                      <HStack key={i} alignItems="center" mr={ms(5)}>
                        <Text color={Colors.disabled} bold>
                          {`(${Math.ceil(cargo.tonnage)} MT) `}
                        </Text>
                        <Text
                          flex="1"
                          color={Colors.highlighted_text}
                          bold
                          numberOfLines={1}
                          ellipsizeMode="tail"
                        >
                          {/* ${Math.ceil(cargo.actualTonnage)} MT -  */}
                          {` ${
                            cargo.type.nameEn !== null
                              ? cargo.type.nameEn
                              : 'Unknown'
                          }`}
                        </Text>
                        <Image
                          alt="navlogs-tags"
                          source={Icons.tags}
                          mx={ms(5)}
                          resizeMode="contain"
                        />
                      </HStack>
                    )
                  })}
                <HStack alignItems="center" mt={ms(5)}>
                  <Text color={Colors.highlighted_text} bold>
                    {calculateTotalOut(navigationLog)} MT
                  </Text>
                  <Image
                    alt="triple-arrow-navlogs"
                    source={Icons.triple_arrow}
                    mx={ms(5)}
                    resizeMode="contain"
                  />
                  <Text color={Colors.highlighted_text} bold>
                    {calculateTotalIn(navigationLog)} MT
                  </Text>
                </HStack>
              </Box>
              <Box alignItems="center">
                <NavigationLogType navigationLog={navigationLog} />
                <Text color={Colors.azure} fontSize={ms(15)} mt={ms(5)} bold>
                  {Math.ceil(navigationLog?.bulkCargo[0]?.actualTonnage)} MT
                </Text>
              </Box>
            </HStack>
          </Box>
        </Box>
      </TouchableOpacity>
    )
  }

  const onPullRefresh = () => {
    getVesselPlannedNavLogs(vesselId)
  }

  if (isPlanningLoading) return <LoadingAnimated />

  return (
    <Box flex="1" bgColor={Colors.white}>
      <ScrollView
        contentContainerStyle={{flexGrow: 1, paddingBottom: 20}}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            onRefresh={onPullRefresh}
            refreshing={isPlanningLoading}
          />
        }
        px={ms(12)}
        py={ms(15)}
      >
        {hasErrorLoadingPlannedNavigationLogs ? (
          <Box flex="1" bgColor={Colors.white} p="5">
            <Center>
              <Text bold color={Colors.azure}>
                Failed to load requested resource
              </Text>
            </Center>
          </Box>
        ) : plannedNavigationLogs.length == 0 ? (
          <Box flex="1" bgColor={Colors.white} p="2">
            <Center>
              <Text bold color={Colors.azure}>
                No results available
              </Text>
            </Center>
          </Box>
        ) : (
          plannedNavigationLogs.map((navigationLog: any, i: number) => (
            <NavLogCard key={i} navigationLog={navigationLog} />
          ))
        )}
      </ScrollView>
    </Box>
  )
}

export default PlanningLogbook
