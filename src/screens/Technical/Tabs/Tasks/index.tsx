import React, {useEffect, useState} from 'react'
import {Dimensions, RefreshControl, TouchableOpacity} from 'react-native'
import {Box, HStack, Icon, Image, ScrollView, Text} from 'native-base'
import {ms} from 'react-native-size-matters'
import {useNavigation} from '@react-navigation/native'

import {Colors} from '@bluecentury/styles'
import {useEntity, useTechnical} from '@bluecentury/stores'
import {LoadingAnimated} from '@bluecentury/components'
import {Icons} from '@bluecentury/assets'
import {useTranslation} from 'react-i18next'
import {TaskSection} from '@bluecentury/models'

const {width} = Dimensions.get('window')
const Tasks = () => {
  const {t} = useTranslation()
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
        refreshControl={
          <RefreshControl refreshing={pullRefresh} onRefresh={onPullRefresh} />
        }
        bg={Colors.white}
        px={ms(12)}
        py={ms(20)}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
      >
        <Text bold color={Colors.azure} fontSize={ms(20)} mb={ms(15)}>
          {t('overview')}
        </Text>
        <HStack
          alignItems="center"
          flexWrap="wrap"
          justifyContent="space-evenly"
        >
          {tasksCategory?.length > 0 ? (
            tasksCategory?.map((task: TaskSection, index) => {
              let icon
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
                    alignItems="center"
                    bg={Colors.white}
                    borderRadius={ms(5)}
                    justifyContent="center"
                    mt={ms(10)}
                    p={30}
                    shadow={4}
                    w={width / 2 - 30}
                  >
                    <Image alt={`${task.key}-icon`} mb={ms(15)} source={icon} />
                    <Text bold color={Colors.text} fontSize={ms(22)}>
                      {task.count}
                    </Text>
                    <Text color={Colors.text} fontWeight="medium">
                      {t(task.label)}
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
