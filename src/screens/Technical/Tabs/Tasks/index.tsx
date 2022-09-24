import React, {useEffect, useState} from 'react'
import {Dimensions, RefreshControl, TouchableOpacity} from 'react-native'
import {Box, HStack, Icon, Image, ScrollView, Text} from 'native-base'
import {ms} from 'react-native-size-matters'
import {useNavigation} from '@react-navigation/native'

import {Colors} from '@bluecentury/styles'
import {useEntity, useTechnical} from '@bluecentury/stores'
import {LoadingAnimated} from '@bluecentury/components'
import {Icons} from '@bluecentury/assets'

const {width} = Dimensions.get('window')
const Tasks = () => {
  const navigation = useNavigation()
  const {isTechnicalLoading, tasksCategory, getVesselTasksCategory} =
    useTechnical()
  const {vesselId} = useEntity()
  const [pullRefresh, setPullRefresh] = useState(false)

  useEffect(() => {
    getVesselTasksCategory(vesselId)
  }, [vesselId])

  const onPullRefresh = () => {
    setPullRefresh(true)
    getVesselTasksCategory(vesselId)
    setPullRefresh(false)
  }

  // if (isTechnicalLoading) return <LoadingAnimated />

  return (
    <Box flex="1">
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          paddingBottom: 20,
        }}
        scrollEventThrottle={16}
        refreshControl={
          <RefreshControl onRefresh={onPullRefresh} refreshing={pullRefresh} />
        }
        px={ms(12)}
        py={ms(20)}
        bg={Colors.white}
      >
        <Text
          fontSize={ms(20)}
          fontWeight="bold"
          color={Colors.azure}
          mb={ms(15)}
        >
          Overview
        </Text>
        <HStack
          flexWrap="wrap"
          justifyContent="space-evenly"
          alignItems="center"
        >
          {tasksCategory?.length > 0 ? (
            tasksCategory?.map((task: any, index) => {
              let icon = undefined
              switch (task.icon) {
                case 'clipboard':
                  icon = Icons.clipboard
                  break
                case 'calendar-week':
                  icon = Icons.calendar_week
                  break
                case 'layer-group':
                  icon = Icons.layer_group
                  break
                case 'overdue':
                  icon = Icons.overdue_tasks
                  break
                case 'flag':
                  icon = Icons.flag
                  break
                default:
                  icon = Icons.clipboard
                  break
              }
              return (
                <TouchableOpacity
                  key={index}
                  activeOpacity={0.6}
                  onPress={() =>
                    navigation.navigate('TechnicalTasksList', {
                      category: task.key,
                      title: task.label,
                    })
                  }
                >
                  <Box
                    w={width / 2 - 30}
                    p={30}
                    alignItems="center"
                    justifyContent="center"
                    bg={Colors.white}
                    borderRadius={ms(5)}
                    shadow={4}
                    mt={ms(10)}
                  >
                    <Image alt={`${task.key}-icon`} source={icon} mb={ms(15)} />
                    <Text
                      fontSize={ms(22)}
                      fontWeight="bold"
                      color={Colors.text}
                    >
                      {task.count}
                    </Text>
                    <Text fontWeight="medium" color={Colors.text}>
                      {task.label}
                    </Text>
                  </Box>
                </TouchableOpacity>
              )
            })
          ) : (
            <LoadingAnimated />
          )}
        </HStack>
      </ScrollView>
    </Box>
  )
}

export default Tasks
