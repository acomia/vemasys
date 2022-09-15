import React, {useEffect} from 'react'
import {RefreshControl, TouchableOpacity} from 'react-native'
import {Avatar, Box, HStack, ScrollView, Text} from 'native-base'
import {Calendar} from 'react-native-calendars'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import {Colors} from '@bluecentury/styles'
import {ms} from 'react-native-size-matters'
import moment from 'moment'

import {
  getAvailableColors,
  hasSelectedEntityUserSomePermission,
  ROLE_PERMISSION_USER_EDIT,
  ROLE_PERMISSION_USER_MANAGE,
  ROLE_PERMISSION_USER_VIEW,
  titleCase
} from '@bluecentury/constants'
import {PROD_URL} from '@vemasys/env'
import {LoadingIndicator} from '@bluecentury/components'
import {useCrew, useEntity} from '@bluecentury/stores'

const Planning = () => {
  const {isCrewLoading, crew, planning, getCrew, getCrewPlanning} = useCrew()
  const {selectedEntity, vesselId} = useEntity()
  const isAllowedToManageUser = hasSelectedEntityUserSomePermission(
    selectedEntity,
    [
      ROLE_PERMISSION_USER_VIEW,
      ROLE_PERMISSION_USER_EDIT,
      ROLE_PERMISSION_USER_MANAGE
    ]
  )

  let crewMatrix: any = {}
  let colors: any = {}

  useEffect(() => {
    getCrewColors()
    createCrewMatrix()
  }, [vesselId])

  const getCrewColors = () => {
    if (!crew || !crew.length) return

    const colorStack = [...getAvailableColors()]

    const colorsTemp: any = {}
    crew.forEach((member: any) => {
      colorsTemp[member.id] =
        colorStack.length > 0
          ? colorStack.pop()
          : '#' + ((Math.random() * 0xffffff) << 0).toString(16)
    })
    console.log('colors', colorsTemp)

    colors = colorsTemp
  }

  const createCrewMatrix = () => {
    if (!planning || !planning.length) return
    const crewMtx: any = {}
    planning.forEach((p: any) => {
      if (!crewMatrix[p.user.id]) {
        crewMatrix[p.user.id] = {}
      }

      const dayOfMonth = moment(p.plannedStartDate).get('date')
      crewMatrix[p.user.id][dayOfMonth] = true
    })
    console.log('matrix', crewMtx)

    crewMatrix = crewMtx
  }

  const getCrewPlanningDates = () => {
    if (!crewMatrix || Object.entries(crewMatrix).length <= 0 || !crew) {
      return
    }

    const dates: any = {}

    const daysInMonth = [
      ...Array(moment(new Date()).endOf('month').date()).keys()
    ].map(k => k + 1)

    daysInMonth.forEach(day => {
      const date = moment(new Date()).date(day).format('YYYY-MM-DD')
      const currentObject = {periods: []}

      crew.forEach((c: any) => {
        if (!crewMatrix[c.id]) return

        const isWorking = !!crewMatrix[c.id][day]
        const startingDay =
          isWorking && (day === 1 || !crewMatrix[c.id][day - 1])
        const endingDay =
          isWorking &&
          (day + 1 >= daysInMonth.length || !crewMatrix[c.id][day + 1])

        currentObject.periods.push({
          startingDay,
          endingDay,
          color: isWorking ? colors[c.id] : colors[c.id] + '11'
        })
      })

      dates[date] = currentObject
    })
    return dates
  }

  const onPullToReload = () => {
    getCrew(vesselId)
    getCrewPlanning(vesselId)
  }

  const renderCrew = () => {
    if (!crew || crew.length <= 0)
      return (
        <Box flex="1" mt={ms(20)} justifyContent="center" alignItems="center">
          <Text>No entries for this month.</Text>
        </Box>
      )

    return (
      <ScrollView
        contentContainerStyle={{flexGrow: 1, paddingBottom: 20}}
        bg={Colors.white}
        px={ms(12)}
        py={ms(20)}
      >
        {crew.map((user: any, index: number) => (
          <TouchableOpacity
            key={`User-${index}`}
            disabled={!isAllowedToManageUser}
            // onPress={(): Promise<any> => selectCrewMember(user)}
          >
            <HStack
              justifyContent="space-between"
              alignItems="center"
              mb={ms(5)}
              p={ms(10)}
              borderRadius={ms(5)}
              bg={Colors.white}
              shadow={1}
            >
              <HStack alignItems="center">
                {user.icon !== null ? (
                  <Avatar
                    size="30px"
                    source={{
                      uri: `${PROD_URL}/${user.icon}`
                    }}
                  />
                ) : (
                  <Box
                    w={ms(30)}
                    h={ms(30)}
                    borderRadius={ms(50)}
                    bg={Colors.disabled}
                    justifyContent="center"
                    alignItems="center"
                  >
                    <MaterialIcons name="person" color="white" size={20} />
                  </Box>
                )}
                <Text ml={ms(10)} fontWeight="medium">
                  {titleCase(user.firstname)} {titleCase(user.lastname)}
                </Text>
              </HStack>
              <MaterialIcons name="arrow-forward-ios" color={colors[user.id]} />
            </HStack>
          </TouchableOpacity>
        ))}
      </ScrollView>
    )
  }

  if (isCrewLoading) return <LoadingIndicator />

  return (
    <Box flex="1" bg={Colors.white}>
      <ScrollView
        refreshControl={
          <RefreshControl
            onRefresh={onPullToReload}
            refreshing={isCrewLoading}
          />
        }
      >
        <Calendar
          current={new Date().toLocaleDateString()}
          hideArrows={true}
          hideExtraDays={true}
          disableMonthChange={true}
          firstDay={7}
          onPressArrowLeft={subtractMonth => subtractMonth()}
          onPressArrowRight={addMonth => addMonth()}
          disableAllTouchEventsForDisabledDays={true}
          enableSwipeMonths={false}
          markedDates={getCrewPlanningDates()}
          markingType="multi-period"
        />
        {renderCrew()}
      </ScrollView>
    </Box>
  )
}

export default Planning
