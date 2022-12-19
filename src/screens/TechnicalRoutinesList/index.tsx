import React, {useEffect} from 'react'
import {RefreshControl, TouchableOpacity} from 'react-native'
import {Box, Divider, HStack, Image, ScrollView, Text} from 'native-base'
import {NativeStackScreenProps} from '@react-navigation/native-stack'
import {ms} from 'react-native-size-matters'
import moment from 'moment'

import {Colors} from '@bluecentury/styles'
import {useEntity, useTechnical} from '@bluecentury/stores'
import {LoadingAnimated} from '@bluecentury/components'
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'
import {Icons} from '@bluecentury/assets'

type Props = NativeStackScreenProps<RootStackParamList>
const TechnicalRoutinesList = ({navigation, route}: Props) => {
  const {category} = route.params
  const {isTechnicalLoading, routinesByCategory, getVesselRoutinesByCategory} =
    useTechnical()
  const {vesselId} = useEntity()

  useEffect(() => {
    getVesselRoutinesByCategory(vesselId, category)
  }, [])

  const renderIcon = () => {
    let icon = undefined
    switch (category) {
      case 'clipboard':
        icon = Icons.clipboard
        break
      case 'archived':
        icon = Icons.status_archived
        break
      case 'in_order':
        icon = Icons.status_check_alt
        break
      case 'due':
        icon = Icons.status_exclamation_alt
        break
      case 'overdue':
        icon = Icons.status_x_alt
        break
      default:
        icon = Icons.clipboard
        break
    }
    return (
      <Image
        alt={`${category}-icon`}
        source={icon}
        style={{width: 25, height: 25}}
      />
    )
  }

  const renderType = (type: string) => {
    let iconName
    if (type.includes('hour')) {
      iconName = 'tachometer-alt'
    } else {
      iconName = 'calendar-alt'
    }
    return (
      <FontAwesome5
        name={iconName}
        size={18}
        color={Colors.azure}
        style={{marginRight: 10}}
      />
    )
  }

  const onPullToReload = () => {
    getVesselRoutinesByCategory(vesselId, category)
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
        scrollEventThrottle={16}
        refreshControl={
          <RefreshControl
            onRefresh={onPullToReload}
            refreshing={isTechnicalLoading}
          />
        }
        p={ms(12)}
        showsVerticalScrollIndicator={false}
      >
        {routinesByCategory?.length > 0
          ? routinesByCategory?.map((routine: any, index: number) => {
              return (
                <TouchableOpacity
                  key={index}
                  activeOpacity={0.6}
                  onPress={() =>
                    navigation.navigate('TechnicalRoutineDetails', {
                      id: routine?.id,
                      title: routine?.title,
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
                    <HStack
                      backgroundColor={Colors.border}
                      alignItems="center"
                      px={ms(16)}
                      py={ms(10)}
                    >
                      <Text
                        flex="1"
                        color={Colors.azure}
                        bold
                        fontSize={ms(15)}
                      >
                        {routine?.title}
                      </Text>
                      {renderIcon()}
                    </HStack>
                    {/* End of title header */}
                    {/* Content */}
                    <Box py={ms(14)}>
                      {/* <HStack px={ms(14)}>
                        <Text flex="1" fontWeight="medium">
                          Type
                        </Text>
                        {renderType(routine?.scheduleLabel)}
                      </HStack>
                      <Divider my={ms(14)} /> */}
                      <HStack px={ms(14)}>
                        <Text flex="1" fontWeight="medium">
                          Planning
                        </Text>
                        {renderType(routine?.scheduleLabel)}
                        <Text>{routine?.scheduleLabel}</Text>
                      </HStack>
                      <Divider my={ms(14)} />
                      <HStack px={ms(14)}>
                        <Text flex="1" fontWeight="medium">
                          Next due date
                        </Text>
                        <Text>
                          {routine?.datetime
                            ? moment(routine?.datetime).format('D MMM YYYY')
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

export default TechnicalRoutinesList
