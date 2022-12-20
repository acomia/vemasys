import React, {useEffect, useState} from 'react'
import {RefreshControl, TouchableOpacity} from 'react-native'
import {
  Box,
  Button,
  HStack,
  Icon,
  Image,
  Modal,
  ScrollView,
  Text,
  useToast,
} from 'native-base'
import {ms} from 'react-native-size-matters'
import {
  NavigationProp,
  useIsFocused,
  useNavigation,
} from '@react-navigation/native'
import Ionicons from 'react-native-vector-icons/Ionicons'
import moment from 'moment'
import _ from 'lodash'
import {Shadow} from 'react-native-shadow-2'

import {Colors} from '@bluecentury/styles'
import {Animated, Icons} from '@bluecentury/assets'
import {usePlanning} from '@bluecentury/stores'
import {titleCase} from '@bluecentury/constants'
import {LoadingAnimated} from '@bluecentury/components'

const Actions = () => {
  const toast = useToast()
  const focused = useIsFocused()
  const navigation = useNavigation<NavigationProp<RootStackParamList>>()
  const {
    isPlanningLoading,
    navigationLogDetails,
    navigationLogActions,
    getNavigationLogActions,
    isCreateNavLogActionSuccess,
    isUpdateNavLogActionSuccess,
    isDeleteNavLogActionSuccess,
    updateNavigationLogAction,
    reset,
  } = usePlanning()
  const [buttonActionLabel, setButtonActionLabel] = useState('Loading')
  const [selectedAction, setSelectedAction] = useState<NavigationLogAction>({})
  const [confirmModal, setConfirmModal] = useState(false)

  useEffect(() => {
    if (
      navigationLogDetails?.bulkCargo?.some(cargo => cargo.isLoading === false)
    ) {
      setButtonActionLabel('Unloading')
    } else {
      setButtonActionLabel('Loading')
    }
    if (isUpdateNavLogActionSuccess && focused) {
      getNavigationLogActions(navigationLogDetails?.id)
      showToast('Action ended.', 'success')
    }
  }, [
    isCreateNavLogActionSuccess,
    isUpdateNavLogActionSuccess,
    isDeleteNavLogActionSuccess,
  ])

  const showToast = (text: string, res: string) => {
    toast.show({
      duration: 2000,
      render: () => {
        return (
          <Text
            bg={res === 'success' ? 'emerald.500' : 'red.500'}
            px="2"
            py="1"
            rounded="sm"
            mb={5}
            color={Colors.white}
          >
            {text}
          </Text>
        )
      },
      onCloseComplete() {
        res === 'success' ? reset() : null
      },
    })
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

  const confirmStopAction = (action: any) => {
    setConfirmModal(true)
    setSelectedAction({
      ...selectedAction,
      id: action.id,
      type: titleCase(action.type),
      start: action.start,
      estimatedEnd: action.estimatedEnd,
      end: new Date(),
      cargoHoldActions: [
        {
          navigationBulk: action?.navigationBulk?.id,
          amount: action?.navigationBulk?.amount.toString(),
        },
      ],
    })
  }

  const onStopAction = () => {
    // console.log(selectedAction)
    setConfirmModal(false)
    updateNavigationLogAction(
      selectedAction?.id,
      navigationLogDetails?.id,
      selectedAction
    )
  }

  const onPullToReload = () => {
    getNavigationLogActions(navigationLogDetails?.id)
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
        <Text fontSize={ms(20)} bold color={Colors.azure}>
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
                      <Text bold fontSize={ms(15)} color={Colors.text}>
                        {titleCase(action.type)}
                      </Text>
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
                  <TouchableOpacity
                    disabled={_.isNull(action.end) ? false : true}
                    activeOpacity={0.7}
                    onPress={() => confirmStopAction(action)}
                  >
                    <Image
                      alt="navlog-action-icon"
                      source={_.isNull(action.end) ? Icons.stop : null}
                    />
                  </TouchableOpacity>
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
      <Modal
        isOpen={confirmModal}
        size="full"
        px={ms(12)}
        animationPreset="slide"
      >
        <Modal.Content>
          <Modal.Header>Confirmation</Modal.Header>
          <Text my={ms(20)} mx={ms(12)} fontWeight="medium">
            Are you sure you want to stop this action?
          </Text>
          <HStack>
            <Button
              flex="1"
              m={ms(12)}
              bg={Colors.grey}
              onPress={() => setConfirmModal(false)}
            >
              <Text fontWeight="medium" color={Colors.disabled}>
                Cancel
              </Text>
            </Button>
            <Button
              flex="1"
              m={ms(12)}
              bg={Colors.danger}
              onPress={onStopAction}
            >
              <Text fontWeight="medium" color={Colors.white}>
                Stop
              </Text>
            </Button>
          </HStack>
        </Modal.Content>
      </Modal>
    </Box>
  )
}

export default Actions
