import React, {useEffect} from 'react'
import {Avatar, Box, HStack, Image, ScrollView, Text} from 'native-base'
import {Calendar, CalendarList, Agenda} from 'react-native-calendars'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import {Colors} from '@bluecentury/styles'
import {ms} from 'react-native-size-matters'
import {Icons} from '@bluecentury/assets'
import {useCrew} from '@bluecentury/stores'
import moment from 'moment'
import {getAvailableColors, titleCase} from '@bluecentury/constants'
import {TouchableOpacity} from 'react-native'
import {PROD_URL} from '@bluecentury/env'
import {LoadingIndicator} from '@bluecentury/components'

const Planning = () => {
  const {isCrewLoading, crew, planning} = useCrew()

  let crewMatrix: any = {}
  let colors: any = {}

  useEffect(() => {
    getCrewColors()
    createCrewMatrix()
  }, [])

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
    console.log('dates', dates)
    return dates
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
            // disabled={!isAllowedToViewUser}
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
    </Box>
  )
}

export default Planning
