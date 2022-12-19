import React, {useEffect} from 'react'
import {RefreshControl, TouchableOpacity} from 'react-native'
import {Box, Divider, HStack, ScrollView, Text} from 'native-base'
import {NativeStackScreenProps} from '@react-navigation/native-stack'
import {ms} from 'react-native-size-matters'
import Icon from 'react-native-vector-icons/Ionicons'
import moment from 'moment'

import {Colors} from '@bluecentury/styles'
import {useEntity, useTechnical} from '@bluecentury/stores'
import {LoadingAnimated} from '@bluecentury/components'

type Props = NativeStackScreenProps<RootStackParamList>
const TechnicalTasksList = ({navigation, route}: Props) => {
  const {category} = route.params
  const {isTechnicalLoading, tasksByCategory, getVesselTasksByCategory} =
    useTechnical()
  const {vesselId} = useEntity()

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity
          style={{flexDirection: 'row', alignItems: 'center'}}
          onPress={() =>
            navigation.navigate('AddEditTechnicalTask', {method: 'add'})
          }
        >
          <Icon name="add" color={Colors.highlighted_text} size={24} />
          <Text bold color={Colors.highlighted_text}>
            Add a task
          </Text>
        </TouchableOpacity>
      ),
    })
    getVesselTasksByCategory(vesselId, category)
  }, [])

  const renderStatuses = (status: string) => {
    let title = ''
    let color = ''
    let textColor = ''
    switch (status) {
      case 'todo':
        title = 'To do'
        color = '#E0E0E0'
        textColor = Colors.text
        break

      case 'done':
        title = 'Done'
        color = Colors.secondary
        textColor = Colors.white
        break
      case 'in_progress':
        title = 'In Progress'
        color = Colors.secondary
        textColor = Colors.white
        break
      case 'overdue':
        title = 'Overdue'
        color = Colors.danger
        textColor = Colors.white
        break
    }
    return (
      <Text
        bg={color}
        py={ms(3)}
        px={ms(20)}
        borderRadius={ms(25)}
        fontWeight="medium"
        fontSize={ms(12)}
        color={textColor}
      >
        {title}
      </Text>
    )
  }

  const renderLabels = (label: string) => {
    let title = ''
    let color = ''
    let textColor = ''
    switch (label?.toLowerCase()) {
      case 'maintenance':
        title = 'Maintenance'
        color = Colors.primary
        textColor = Colors.white
        break
      case 'check':
        title = 'Check'
        color = Colors.secondary
        textColor = Colors.white
        break
      case 'incident':
        title = 'Incident'
        color = Colors.warning
        textColor = Colors.white
        break
    }
    return (
      <Text
        bg={color}
        py={ms(3)}
        px={ms(20)}
        borderRadius={ms(25)}
        fontWeight="medium"
        fontSize={ms(12)}
        color={textColor}
      >
        {title}
      </Text>
    )
  }

  const onPullToReload = () => {
    getVesselTasksByCategory(vesselId, category)
  }

  if (isTechnicalLoading) return <LoadingAnimated />

  return (
    <Box
      flex="1"
      bg={Colors.white}
      borderTopLeftRadius={ms(15)}
      borderTopRightRadius={ms(15)}
    >
      <ScrollView
        contentContainerStyle={{flexGrow: 1, paddingBottom: 30}}
        refreshControl={
          <RefreshControl
            onRefresh={onPullToReload}
            refreshing={isTechnicalLoading}
          />
        }
        p={ms(12)}
      >
        {tasksByCategory?.length > 0
          ? tasksByCategory?.map((task: any, index: number) => {
              return (
                <TouchableOpacity
                  key={index}
                  activeOpacity={0.6}
                  onPress={() =>
                    navigation.navigate('TechnicalTaskDetails', {
                      task: task,
                      category: category,
                    })
                  }
                >
                  <Box
                    borderRadius={ms(5)}
                    borderWidth={1}
                    borderColor={Colors.light}
                    mt={ms(10)}
                    overflow="hidden"
                  >
                    {/* Title header */}
                    <Box
                      backgroundColor={Colors.border}
                      px={ms(16)}
                      py={ms(10)}
                    >
                      <Text color={Colors.azure} bold fontSize={ms(15)}>
                        {task?.title}
                      </Text>
                    </Box>
                    {/* End of title header */}
                    {/* Content */}
                    <Box py={ms(14)}>
                      <HStack px={ms(14)}>
                        <Text flex="1" fontWeight="medium">
                          Part
                        </Text>
                        <Text>{task?.vesselPart?.name}</Text>
                      </HStack>
                      <Divider my={ms(14)} />
                      <HStack px={ms(14)}>
                        <Text flex="1" fontWeight="medium">
                          Status
                        </Text>
                        {renderStatuses(task?.statusCode)}
                      </HStack>
                      <Divider my={ms(14)} />
                      <HStack px={ms(14)}>
                        <Text flex="1" fontWeight="medium">
                          Labels
                        </Text>
                        {renderLabels(task?.labels[0]?.title)}
                      </HStack>
                      <Divider my={ms(14)} />
                      <HStack px={ms(14)}>
                        <Text flex="1" fontWeight="medium">
                          Scheduled date
                        </Text>
                        <Text>
                          {task?.deadline
                            ? moment(task?.deadline).format('D MMM YYYY')
                            : 'Not set'}
                        </Text>
                      </HStack>
                    </Box>
                  </Box>
                </TouchableOpacity>
              )
            })
          : null}
      </ScrollView>
    </Box>
  )
}

export default TechnicalTasksList
