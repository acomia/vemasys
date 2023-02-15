import React, {useEffect} from 'react'
import {RefreshControl} from 'react-native'
import {Box, Center, ScrollView, Text} from 'native-base'
import {ms} from 'react-native-size-matters'
import moment from 'moment'
import {Colors} from '@bluecentury/styles'
import {useEntity, usePlanning} from '@bluecentury/stores'
import {LoadingAnimated} from '@bluecentury/components'
import {useTranslation} from 'react-i18next'
import {NavLogCard, NavLogDivider} from '@bluecentury/components'

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

  // Logic to choose right colour for planned item start

  const colours = [
    Colors.navLogItemBlue,
    Colors.navLogItemOrange,
    Colors.navLogItemViolet,
    Colors.navLogItemPink,
    Colors.navLogItemGreen,
  ]

  //This function has two steps on first one we create an array of unique planned items,
  // on the second we define a colour of each item
  // after that we return an array of unique items with colour
  const addColourToUniqueItem = (arr: NavigationLog[]) => {
    const uniqueCharters: NavigationLog[] = []
    arr.forEach(item => {
      if (!item.charter.id) {
        uniqueCharters.push(item)
      } else {
        const found = uniqueCharters.find(
          uniqueItem => item.charter.id === uniqueItem.charter?.id
        )
        if (!found) {
          uniqueCharters.push(item)
        }
      }
    })
    let index = 0
    return uniqueCharters.map(item => {
      if (index === colours.length - 1) {
        index = 0
        return {...item, colour: colours[colours.length - 1]}
      } else {
        index += 1
        return {...item, colour: colours[index - 1]}
      }
    })
  }

  const arrayWithColours = addColourToUniqueItem(plannedNavigationLogs)

  // This function looks for items in unique items array and returns a colour for passed item
  const defineColour = (item: NavigationLog) => {
    if (item.charter.id) {
      return arrayWithColours.find(
        secondaryItem => secondaryItem.charter.id === item.charter.id
      )?.colour
    } else {
      return arrayWithColours.find(
        secondaryItem => secondaryItem.id === item.id
      )?.colour
    }
  }

  //Logic to choose right colour for planned item end

  // Logic to add the line united planned items with common charter start
  const defineFirstAndLastIndex = arrayWithColours.map(item => {
    return {
      ...item,
      firstIndex: plannedNavigationLogs?.findIndex(planned =>
        item.charter.id
          ? planned.charter.id === item.charter.id
          : planned.id === item.id
      ),
      lastIndex: plannedNavigationLogs?.findLastIndex(
        (planned: NavigationLog) =>
          item.charter.id
            ? planned.charter.id === item.charter.id
            : planned.id === item.id
      ),
    }
  })

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
        pr={ms(12)}
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
          plannedNavigationLogs?.map((navigationLog, i: number) => {
            const plannedEta = moment(navigationLog.plannedEta).format('YYYY-MM-DD');
            const dateToday = moment().format('YYYY-MM-DD')
            const previousDate = moment(plannedNavigationLogs[i - 1]?.plannedEta).format('YYYY-MM-DD');

            if (plannedEta === dateToday && previousDate < dateToday) {
              <NavLogDivider key={`divider_${i}`}/>
            }
            return (
              <>
                {plannedEta === dateToday && previousDate < dateToday
                  ? <NavLogDivider key={`divider_${i}`}/>
                  : null
                }
                <NavLogCard
                  key={i}
                  index={i}
                  navigationLog={navigationLog}
                  defineFirstAndLastIndex={defineFirstAndLastIndex}
                  itemColor={defineColour(navigationLog)}
                />
              </>
            )
        })
        )}
      </ScrollView>
    </Box>
  )
}

export default PlanningLogbook
