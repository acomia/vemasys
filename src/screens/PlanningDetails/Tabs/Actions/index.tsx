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
import _ from 'lodash'
import {Shadow} from 'react-native-shadow-2'
import {useTranslation} from 'react-i18next'

import {Colors} from '@bluecentury/styles'
import {usePlanning} from '@bluecentury/stores'
import {titleCase} from '@bluecentury/constants'
import {LoadingAnimated} from '@bluecentury/components'
import {Vemasys} from '@bluecentury/helpers'
import {ActionCard} from '../../components'

const Actions = () => {
  const {t} = useTranslation()
  const toast = useToast()
  const focused = useIsFocused()
  const navigation = useNavigation<NavigationProp<RootStackParamList>>()
  const {
    isPlanningActionsLoading,
    navigationLogDetails,
    navigationLogActions,
    getNavigationLogActions,
    isCreateNavLogActionSuccess,
    isUpdateNavLogActionSuccess,
    isDeleteNavLogActionSuccess,
    updateNavigationLogAction,
    reset,
  } = usePlanning()
  const [buttonActionLabel, setButtonActionLabel] = useState(t('loading'))
  const [selectedAction, setSelectedAction] = useState<NavigationLogAction>({})
  const [confirmModal, setConfirmModal] = useState(false)

  useEffect(() => {
    if (isUpdateNavLogActionSuccess && focused) {
      getNavigationLogActions(navigationLogDetails?.id)
      showToast('Action ended.', 'success')
    }
  }, [
    isCreateNavLogActionSuccess,
    isUpdateNavLogActionSuccess,
    isDeleteNavLogActionSuccess,
  ])

  useEffect(() => {
    if (
      navigationLogDetails?.bulkCargo?.some(cargo => cargo.isLoading === false)
    ) {
      setButtonActionLabel(t('unloading'))
    } else {
      setButtonActionLabel(t('loading'))
    }
  }, [navigationLogActions, navigationLogDetails])

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

  const confirmStopAction = (action: any) => {
    setConfirmModal(true)
    setSelectedAction({
      ...selectedAction,
      id: action.id,
      type: titleCase(action.type),
      start: action.start,
      estimatedEnd: action.estimatedEnd,
      end: Vemasys.defaultDatetime(),
      cargoHoldActions: [
        {
          navigationBulk: action?.navigationBulk?.id,
          amount: action?.navigationBulk?.amount.toString(),
        },
      ],
    })
  }

  const onStopAction = () => {
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

  if (isPlanningActionsLoading) return <LoadingAnimated />

  return (
    <Box flex="1">
      <ScrollView
        contentContainerStyle={{flexGrow: 1, paddingBottom: 30}}
        scrollEventThrottle={16}
        refreshControl={
          <RefreshControl
            onRefresh={onPullToReload}
            refreshing={isPlanningActionsLoading}
          />
        }
        bg={Colors.white}
        px={ms(12)}
        py={ms(20)}
      >
        {/* Actions Section */}
        <Text fontSize={ms(20)} bold color={Colors.azure}>
          {t('actions')}
        </Text>
        {navigationLogActions?.length > 0
          ? navigationLogActions?.map((action, index) => (
              <ActionCard
                key={index}
                action={action}
                onActionPress={() =>
                  navigation.navigate('AddEditNavlogAction', {
                    method: 'edit',
                    navlogAction: action,
                    actionType: action.type,
                  })
                }
                onActionStopPress={() => confirmStopAction(action)}
              />
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
              {t('new')} {buttonActionLabel}
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
              {t('cleaning')}
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
          <Modal.Header>{t('confirmation')}</Modal.Header>
          <Text my={ms(20)} mx={ms(12)} fontWeight="medium">
            {t('areYouSure')}
          </Text>
          <HStack>
            <Button
              flex="1"
              m={ms(12)}
              bg={Colors.grey}
              onPress={() => setConfirmModal(false)}
            >
              <Text fontWeight="medium" color={Colors.disabled}>
                {t('cancel')}
              </Text>
            </Button>
            <Button
              flex="1"
              m={ms(12)}
              bg={Colors.danger}
              onPress={onStopAction}
            >
              <Text fontWeight="medium" color={Colors.white}>
                {t('stop')}
              </Text>
            </Button>
          </HStack>
        </Modal.Content>
      </Modal>
    </Box>
  )
}

export default Actions
