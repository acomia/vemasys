import React, {useEffect} from 'react'
import {RefreshControl} from 'react-native'
import {Box, Center, ScrollView, Text} from 'native-base'
import {ms} from 'react-native-size-matters'
import moment from 'moment'
import {Colors} from '@bluecentury/styles'
import {useEntity, usePlanning} from '@bluecentury/stores'
import {LoadingAnimated} from '@bluecentury/components'
import {useTranslation} from 'react-i18next'
import {NavLogCard} from '@bluecentury/components'

const PlanningLogbook = () => {
  const {t} = useTranslation()
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
    getVesselPlannedNavLogs(vesselId as string)
    /* eslint-disable react-hooks/exhaustive-deps */
    /* eslint-disable react-native/no-inline-styles */
  }, [
    vesselId,
    isCreateNavLogActionSuccess,
    isUpdateNavLogActionSuccess,
    isDeleteNavLogActionSuccess,
  ])

  plannedNavigationLogs?.sort(
    (a: any, b: any) =>
      moment(a.arrivalDatetime || a.plannedEta || a.arrivalZoneTwo).valueOf() -
      moment(b.arrivalDatetime || b.plannedEta || b.arrivalZoneTwo).valueOf()
  )

  const onPullRefresh = () => {
    getVesselPlannedNavLogs(vesselId as string)
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
        ) : plannedNavigationLogs?.length === 0 ? (
          <Box bgColor={Colors.white} flex="1" p="2">
            <Center>
              <Text bold color={Colors.azure}>
                {t('noResultsAvailable')}
              </Text>
            </Center>
          </Box>
        ) : (
          plannedNavigationLogs?.map((navigationLog, i: number) => (
            <NavLogCard key={i} navigationLog={navigationLog} />
          ))
        )}
      </ScrollView>
    </Box>
  )
}

export default PlanningLogbook
