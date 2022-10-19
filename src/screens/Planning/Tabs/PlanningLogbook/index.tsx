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
    hasErrorLoadingVesselHistoryNavLogs,
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
            <Text color={Colors.text} fontSize={ms(15)} fontWeight="bold">
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
            px={ms(16)}
            py={ms(10)}
            pt={3}
            borderWidth={3}
            borderColor={Colors.border}
            borderStyle="dashed"
            mt={-3}
          >
            <HStack alignItems="center" my={ms(5)}>
              <Box flex="1">
                {navigationLog?.bulkCargo &&
                  navigationLog?.bulkCargo.length > 0 && (
                    <Box>
                      {navigationLog?.bulkCargo.map((cargo: any, i: number) => {
                        return (
                          <Text
                            key={i}
                            color={Colors.highlighted_text}
                            fontWeight="bold"
                          >
                            {`${Math.ceil(cargo.tonnage)} MT - ${
                              cargo.type ? cargo.type.nameEn : 'Unknown'
                            }  `}
                            <Image
                              alt="navlogs-tags"
                              source={Icons.tags}
                              mx={ms(5)}
                              resizeMode="contain"
                            />
                          </Text>
                        )
                      })}
                    </Box>
                  )}
                <HStack alignItems="center" mt={ms(5)}>
                  <Text color={Colors.highlighted_text} fontWeight="bold">
                    {calculateTotalOut(navigationLog)} MT
                  </Text>
                  <Image
                    alt="triple-arrow-navlogs"
                    source={Icons.triple_arrow}
                    mx={ms(5)}
                    resizeMode="contain"
                  />
                  <Text color={Colors.highlighted_text} fontWeight="bold">
                    {calculateTotalIn(navigationLog)} MT
                  </Text>
                </HStack>
              </Box>
              <NavigationLogType navigationLog={navigationLog} />
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
        refreshControl={
          <RefreshControl
            onRefresh={onPullRefresh}
            refreshing={isPlanningLoading}
          />
        }
        px={ms(12)}
        py={ms(15)}
      >
        {hasErrorLoadingVesselHistoryNavLogs ? (
          <Box flex="1" bgColor={Colors.white} p="5">
            <Center>
              <Text>Failed to load requested resource</Text>
            </Center>
          </Box>
        ) : (
          plannedNavigationLogs.map((navigationLog: any, i: number) => {
            return <NavLogCard key={i} navigationLog={navigationLog} />
          })
        )}
      </ScrollView>
    </Box>
  )
}

export default PlanningLogbook
