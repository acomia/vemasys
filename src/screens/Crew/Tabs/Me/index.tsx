import React, {useEffect, useRef, useState} from 'react'
import {RefreshControl, TouchableOpacity} from 'react-native'
import {Box, HStack, Image, ScrollView, Text} from 'native-base'
import {Calendar} from 'react-native-calendars'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import moment from 'moment'
import {ms} from 'react-native-size-matters'

import {Colors} from '@bluecentury/styles'
import {Icons} from '@bluecentury/assets'
import {useCrew, useEntity} from '@bluecentury/stores'
import {VESSEL_CREW_PLANNING_ONBOARD} from '@bluecentury/constants'
import {LoadingAnimated} from '@bluecentury/components'

const Me = () => {
  const {isCrewLoading, crew, planning, getCrew, getCrewPlanning} = useCrew()
  const {vesselId, user} = useEntity()
  const isSelfPlanning = !user?.id
  const [currentMonth, setCurrentMonth] = useState(
    new Date().toLocaleDateString()
  )

  const customHeaderProps: any = useRef()

  useEffect(() => {
    if (typeof vesselId !== 'undefined') {
      getCrew(vesselId)
      getCrewPlanning(vesselId)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [vesselId])

  const getSelfPlanningDates = () => {
    if (!planning || !planning.length) return
    const dates: any = {}

    planning
      .filter((p: any) => p.user.id === user?.id)
      .forEach((plan: any) => {
        const startDate = moment(plan.plannedStartDate).format('YYYY-MM-DD')
        const currentObject = dates[startDate]
          ? dates[startDate]
          : {periods: []}

        currentObject.periods.push({
          startingDay: false,
          endingDay: false,
          color:
            plan.type.title.toLowerCase() === VESSEL_CREW_PLANNING_ONBOARD
              ? Colors.secondary
              : Colors.danger,
        })

        dates[startDate] = currentObject
      })
    return dates
  }

  const setCustomHeaderNewMonth = (next: boolean) => {
    console.log('next', next)
    const add = next ? 1 : -1
    const month = customHeaderProps?.current?.month
    console.log(' month', month)
    const newMonth = new Date(month.setMonth(month.getMonth() + add))
    customHeaderProps?.current?.addMonth(add)
    setCurrentMonth(newMonth.toISOString().split('T')[0])
  }
  const moveNext = () => {
    setCustomHeaderNewMonth(true)
  }
  const movePrevious = () => {
    setCustomHeaderNewMonth(false)
  }

  const CustomHeader = React.forwardRef((props, ref) => {
    customHeaderProps.current = props

    return (
      <HStack
        ref={ref}
        {...props}
        justifyContent="space-between"
        // mx={ms(-4)}
        p={ms(10)}
      >
        <Text bold color={Colors.azure} fontSize={ms(20)}>
          {moment(currentMonth).format('MMM yyyy')}
        </Text>
        <HStack>
          <TouchableOpacity onPress={movePrevious}>
            <MaterialIcons
              color={Colors.azure}
              name="arrow-back-ios"
              size={ms(24)}
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={moveNext}>
            <MaterialIcons
              color={Colors.azure}
              name="arrow-forward-ios"
              size={ms(24)}
            />
          </TouchableOpacity>
        </HStack>
      </HStack>
    )
  })

  const onPullToReload = () => {
    if (typeof vesselId !== 'undefined') {
      getCrew(vesselId)
      getCrewPlanning(vesselId)
    }
  }

  if (isCrewLoading) return <LoadingAnimated />

  return (
    <Box bg={Colors.white} flex="1">
      <ScrollView
        refreshControl={
          <RefreshControl
            refreshing={isCrewLoading}
            onRefresh={onPullToReload}
          />
        }
        contentContainerStyle={{flexGrow: 1, paddingBottom: 20}}
      >
        <Calendar
          current={new Date().toLocaleDateString()}
          disableAllTouchEventsForDisabledDays={true}
          disableMonthChange={true}
          enableSwipeMonths={false}
          firstDay={7}
          hideArrows={true}
          hideExtraDays={true}
          markedDates={getSelfPlanningDates()}
          markingType="multi-period"
          onPressArrowLeft={subtractMonth => subtractMonth()}
          onPressArrowRight={addMonth => addMonth()}
          // customHeader={CustomHeader}
        />
        <Box mt={ms(30)} px={ms(12)}>
          <HStack
            bg={Colors.white}
            borderRadius={ms(5)}
            mb={ms(8)}
            px={ms(15)}
            py={ms(20)}
            shadow={5}
          >
            <Text flex="1" fontWeight="medium">
              Working
            </Text>
            <Image alt="working-icon" source={Icons.check} />
          </HStack>
          <HStack
            bg={Colors.white}
            borderRadius={ms(5)}
            mb={ms(8)}
            px={ms(15)}
            py={ms(20)}
            shadow={5}
          >
            <Text flex="1" fontWeight="medium">
              Absent
            </Text>
            <Image
              alt="working-icon"
              h={ms(20)}
              source={Icons.status_x}
              w={ms(20)}
            />
          </HStack>
        </Box>
      </ScrollView>
    </Box>
  )
}

export default Me
