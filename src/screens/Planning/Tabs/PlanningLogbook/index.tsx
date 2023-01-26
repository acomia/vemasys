/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-native/no-inline-styles */
import React, {useEffect} from 'react'
import {RefreshControl, TouchableOpacity} from 'react-native'
import {Box, Center, HStack, Image, ScrollView, Text} from 'native-base'
import {ms} from 'react-native-size-matters'
import moment from 'moment'
import {useNavigation} from '@react-navigation/native'
import {Colors} from '@bluecentury/styles'
import {Icons} from '@bluecentury/assets'
import {useEntity, usePlanning} from '@bluecentury/stores'
import {
  calculateTotalIn,
  calculateTotalOut,
  formatLocationLabel,
} from '@bluecentury/constants'
import {LoadingAnimated, NavigationLogType} from '@bluecentury/components'
import {useTranslation} from 'react-i18next'

const PlanningLogbook = () => {
  const {t} = useTranslation()
  const navigation = useNavigation()
  const {
    isPlanningLoading,
    plannedNavigationLogs,
    getVesselPlannedNavLogs,
    hasErrorLoadingPlannedNavigationLogs,
    isUpdateNavLogActionSuccess,
    isDeleteNavLogActionSuccess,
    isCreateNavLogActionSuccess,
  } = usePlanning()
  const {vesselId} = useEntity()

  useEffect(() => {
    getVesselPlannedNavLogs(vesselId)
  }, [
    vesselId,
    isCreateNavLogActionSuccess,
    isUpdateNavLogActionSuccess,
    isDeleteNavLogActionSuccess,
  ])

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
            <Text bold color={Colors.text} fontSize={ms(15)}>
              {formatLocationLabel(navigationLog?.location)}
            </Text>
            <Text color={'#23475C'} fontWeight="medium">
              {t('planned')}
              {moment(navigationLog?.plannedEta).format('DD MMM YYYY | HH:mm')}
            </Text>
          </Box>
          {/* End of Header */}

          <Box
            borderColor={Colors.border}
            borderStyle="dashed"
            borderWidth={3}
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
                              : 'Unknown'
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

  const onPullRefresh = () => {
    getVesselPlannedNavLogs(vesselId)
  }

  if (isPlanningLoading) return <LoadingAnimated />

  return (
    <Box bgColor={Colors.white} flex="1">
      <ScrollView
        refreshControl={
          <RefreshControl
            refreshing={isPlanningLoading}
            onRefresh={onPullRefresh}
          />
        }
        contentContainerStyle={{flexGrow: 1, paddingBottom: 20}}
        px={ms(12)}
        py={ms(15)}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
      >
        {hasErrorLoadingPlannedNavigationLogs ? (
          <Box bgColor={Colors.white} flex="1" p="5">
            <Center>
              <Text bold color={Colors.azure}>
                Failed to load requested resource
              </Text>
            </Center>
          </Box>
        ) : plannedNavigationLogs.length == 0 ? (
          <Box bgColor={Colors.white} flex="1" p="2">
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
