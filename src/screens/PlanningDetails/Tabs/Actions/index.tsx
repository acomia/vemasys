import React, {useEffect, useState} from 'react'
import {RefreshControl, TouchableOpacity} from 'react-native'
import {Box, Button, HStack, Icon, Image, ScrollView, Text} from 'native-base'
import {ms} from 'react-native-size-matters'
import {NavigationProp, useNavigation} from '@react-navigation/native'
import Ionicons from 'react-native-vector-icons/Ionicons'
import moment from 'moment'
import _ from 'lodash'

import {Colors} from '@bluecentury/styles'
import {Animated, Icons} from '@bluecentury/assets'
import {usePlanning} from '@bluecentury/stores'
import {formatNumber, titleCase} from '@bluecentury/constants'
import {LoadingAnimated} from '@bluecentury/components'
import {Shadow} from 'react-native-shadow-2'

const Actions = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>()
  const {
    isPlanningLoading,
    navigationLogDetails,
    navigationLogActions,
    getNavigationLogActions,
    isCreateNavLogActionSuccess,
    isUpdateNavLogActionSuccess,
    isDeleteNavLogActionSuccess,
  } = usePlanning()
  const [buttonActionLabel, setButtonActionLabel] = useState('Loading')

  useEffect(() => {
    getNavigationLogActions(navigationLogDetails?.id)
    if (
      navigationLogDetails?.bulkCargo?.some(cargo => cargo.isLoading === false)
    ) {
      setButtonActionLabel('Unloading')
    } else {
      setButtonActionLabel('Loading')
    }
  }, [
    isCreateNavLogActionSuccess,
    isUpdateNavLogActionSuccess,
    isDeleteNavLogActionSuccess,
  ])

  const onPullToReload = () => {
    getNavigationLogActions(navigationLogDetails?.id)
  }

  const renderAnimatedIcon = (type: string, end: Date) => {
    switch (type.toLowerCase()) {
      case 'unloading':
        return _.isNull(end) ? Animated.nav_unloading : Icons.unloading
      case 'loading':
        return _.isNull(end) ? Animated.nav_loading : Icons.loading
      case 'cleaning':
        return _.isNull(end) ? Animated.cleaning : Icons.broom
      default:
        break
    }
  }

  if (isPlanningLoading) return <LoadingAnimated />

  return (
    <Box flex="1">
      <ScrollView
        contentContainerStyle={{flexGrow: 1, paddingBottom: 30}}
        scrollEventThrottle={16}
        refreshControl={
          <RefreshControl
            onRefresh={onPullToReload}
            refreshing={isPlanningLoading}
          />
        }
        bg={Colors.white}
        px={ms(12)}
        py={ms(20)}
      >
        {/* Actions Section */}
        <Text fontSize={ms(20)} fontWeight="bold" color={Colors.azure}>
          Actions
        </Text>
        {navigationLogActions?.length > 0
          ? navigationLogActions?.map((action, index) => (
              <TouchableOpacity
                activeOpacity={0.7}
                key={index}
                onPress={() =>
                  navigation.navigate('AddEditNavlogAction', {
                    method: 'edit',
                    navlogAction: action,
                    actionType: action.type,
                  })
                }
              >
                <HStack
                  borderWidth={1}
                  borderColor={Colors.light}
                  borderRadius={5}
                  px={ms(12)}
                  py={ms(8)}
                  mt={ms(10)}
                  bg={Colors.white}
                  shadow={1}
                  alignItems="center"
                >
                  <Image
                    alt="navlog-action-animated"
                    source={renderAnimatedIcon(action.type, action.end)}
                    width={ms(40)}
                    height={ms(40)}
                    resizeMode="contain"
                    mr={ms(10)}
                  />
                  <Box flex="1">
                    <HStack alignItems="center">
                      <Text
                        fontWeight="bold"
                        fontSize={ms(15)}
                        color={Colors.text}
                      >
                        {titleCase(action.type)}
                      </Text>
                      {/* {action.type.toLowerCase() !== 'cleaning' &&
                      action.navigationBulk ? (
                        <Text
                          fontWeight="medium"
                          color={Colors.text}
                          ml={ms(5)}
                        >
                          {action.navigationBulk.type.nameEN}
                        </Text>
                      ) : null}
                      <Text fontWeight="bold" color={Colors.text} ml={ms(5)}>
                        {action.value && formatNumber(action.value, 0)}
                      </Text> */}
                    </HStack>
                    <Text color={Colors.secondary} fontWeight="medium">
                      Start -{' '}
                      {moment(action.start).format('D MMM YYYY | hh:mm')}
                    </Text>
                    {_.isNull(action.end) ? null : (
                      <Text color={Colors.danger} fontWeight="medium">
                        End - {moment(action.end).format('D MMM YYYY | hh:mm')}
                      </Text>
                    )}
                  </Box>
                  <Image
                    alt="navlog-action-icon"
                    source={_.isNull(action.end) ? Icons.stop : null}
                  />
                </HStack>
              </TouchableOpacity>
            ))
          : null}
      </ScrollView>
      <Shadow
        viewStyle={{
          width: '100%',
          padding: 13,
          backgroundColor: Colors.white,
        }}
      >
        <HStack>
          <Button
            flex="1"
            maxH={ms(40)}
            bg={Colors.primary}
            leftIcon={<Icon as={Ionicons} name="add" size="sm" />}
            onPress={() =>
              navigation.navigate('AddEditNavlogAction', {
                method: 'add',
                actionType: buttonActionLabel,
              })
            }
          >
            <Text fontWeight="medium" color={Colors.white}>
              New {buttonActionLabel}
            </Text>
          </Button>
          <Box w={ms(10)} />
          <Button
            flex="1"
            maxH={ms(40)}
            bg={Colors.primary}
            leftIcon={<Icon as={Ionicons} name="add" size="sm" />}
            onPress={() =>
              navigation.navigate('AddEditNavlogAction', {
                method: 'add',
                actionType: 'Cleaning',
              })
            }
          >
            <Text fontWeight="medium" color={Colors.white}>
              Cleaning
            </Text>
          </Button>
        </HStack>
      </Shadow>
    </Box>
  )
}

export default Actions
