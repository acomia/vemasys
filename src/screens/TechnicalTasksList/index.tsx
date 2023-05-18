import React, {useEffect} from 'react'
import {RefreshControl, TouchableOpacity} from 'react-native'
import {Box, Button, Divider, HStack, ScrollView, Text, Icon} from 'native-base'
import {NativeStackScreenProps} from '@react-navigation/native-stack'
import {ms} from 'react-native-size-matters'
import moment from 'moment'

import {Colors} from '@bluecentury/styles'
import {useEntity, useTechnical} from '@bluecentury/stores'
import {
  LoadingAnimated,
  NoInternetConnectionMessage,
} from '@bluecentury/components'
import {useTranslation} from 'react-i18next'
import {Shadow} from 'react-native-shadow-2'
import Ionicons from 'react-native-vector-icons/Ionicons'
import {RootStackParamList} from '@bluecentury/types/nav.types'

type Props = NativeStackScreenProps<RootStackParamList, 'TechnicalTasksList'>
const TechnicalTasksList = ({navigation, route}: Props) => {
  const {t} = useTranslation()
  const {category} = route.params
  const {isTechnicalLoading, tasksByCategory, getVesselTasksByCategory} =
    useTechnical()
  const {vesselId} = useEntity()

  useEffect(() => {
    getVesselTasksByCategory(vesselId, category)
  }, [])

  const renderStatuses = (status: string) => {
    let title = ''
    let color = ''
    let textColor = ''
    switch (status) {
      case 'todo':
        title = t('toDo')
        color = Colors.grey
        textColor = Colors.text
        break

      case 'done':
        title = t('done')
        color = Colors.secondary
        textColor = Colors.white
        break
      case 'in_progress':
        title = t('inProgress')
        color = Colors.highlighted_text
        textColor = Colors.white
        break
      case 'overdue':
        title = t('Overdue')
        color = Colors.danger
        textColor = Colors.white
        break
    }
    return (
      <Text
        bg={color}
        borderRadius={ms(25)}
        color={textColor}
        fontSize={ms(12)}
        fontWeight="medium"
        px={ms(20)}
        py={ms(3)}
      >
        {title}
      </Text>
    )
  }

  const renderLabels = (label: {title: string; color: string}) => {
    let title = ''
    switch (label?.title?.toLowerCase()) {
      case 'maintenance':
        title = t('maintenance')
        break
      case 'daily maintenance':
        title = t('dailyMaintenance')
        break
      case 'check':
        title = t('check')
        break
      case 'incident':
        title = t('incident')
        break
    }
    return (
      <Box
        alignSelf="center"
        bg={label?.color}
        borderRadius={ms(25)}
        h={ms(25)}
        px={ms(20)}
        py={ms(3)}
      >
        <Text
          color={Colors.white}
          fontSize={ms(12)}
          fontWeight="medium"
          textAlign="center"
        >
          {title}
        </Text>
      </Box>
    )
  }

  const onPullToReload = () => {
    getVesselTasksByCategory(vesselId, category)
  }

  if (isTechnicalLoading) return <LoadingAnimated />

  return (
    <Box
      bg={Colors.white}
      borderTopLeftRadius={ms(15)}
      borderTopRightRadius={ms(15)}
      flex="1"
    >
      <NoInternetConnectionMessage />
      <ScrollView
        refreshControl={
          <RefreshControl
            refreshing={isTechnicalLoading}
            onRefresh={onPullToReload}
          />
        }
        contentContainerStyle={{flexGrow: 1, paddingBottom: 30}}
        p={ms(12)}
      >
        {tasksByCategory?.length
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
                    borderColor={Colors.light}
                    borderRadius={ms(5)}
                    borderWidth={1}
                    mt={ms(10)}
                  >
                    {/* Title header */}
                    <HStack
                      backgroundColor={Colors.border}
                      justifyContent="space-between"
                      px={ms(16)}
                      py={ms(10)}
                    >
                      <Box w="50%">
                        <Text bold color={Colors.azure} fontSize={ms(15)}>
                          {/*{task?.title}*/}
                          {task?.vesselPart?.name
                            ? `${task?.vesselPart?.name}`
                            : task?.title}
                        </Text>
                      </Box>
                      {task?.labels[0] ? renderLabels(task?.labels[0]) : null}
                    </HStack>
                    {/* End of title header */}
                    {/* Content */}
                    <Box py={ms(14)}>
                      <HStack px={ms(14)}>
                        <Text flex="1" fontWeight="medium">
                          {t('status')}
                        </Text>
                        {renderStatuses(task?.statusCode)}
                      </HStack>
                      {task?.deadline ? (
                        <>
                          <Divider my={ms(14)} />
                          <HStack px={ms(14)}>
                            <Text flex="1" fontWeight="medium">
                              {t('scheduledDate')}
                            </Text>
                            <Text>
                              {moment(task?.deadline).format('D MMM YYYY')}
                            </Text>
                          </HStack>
                        </>
                      ) : null}
                    </Box>
                  </Box>
                </TouchableOpacity>
              )
            })
          : null}
      </ScrollView>
      <Box bg={Colors.white}>
        <Shadow
          viewStyle={{
            width: '100%',
          }}
        >
          <Button
            bg={Colors.primary}
            leftIcon={<Icon as={Ionicons} name="add" size="sm" />}
            m={ms(16)}
            onPress={() =>
              navigation.navigate('AddEditTechnicalTask', {
                method: 'add',
                category,
                vesselId,
              })
            }
          >
            {t('addATask')}
          </Button>
        </Shadow>
      </Box>
    </Box>
  )
}

export default TechnicalTasksList
