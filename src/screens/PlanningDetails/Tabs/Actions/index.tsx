import React, {useEffect, useState} from 'react'
import {RefreshControl} from 'react-native'
import {
  Box,
  Button,
  HStack,
  Icon,
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
    /* eslint-disable react-hooks/exhaustive-deps */
    /* eslint-disable react-native/no-inline-styles */
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
            color={Colors.white}
            mb={5}
            px="2"
            py="1"
            rounded="sm"
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
        refreshControl={
          <RefreshControl
            refreshing={isPlanningActionsLoading}
            onRefresh={onPullToReload}
          />
        }
        bg={Colors.white}
        contentContainerStyle={{flexGrow: 1, paddingBottom: 30}}
        px={ms(12)}
        py={ms(20)}
        scrollEventThrottle={16}
      >
        {/* Actions Section */}
        <Text bold color={Colors.azure} fontSize={ms(20)}>
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
            bg={Colors.primary}
            flex="1"
            leftIcon={<Icon as={Ionicons} name="add" size="sm" />}
            maxH={ms(40)}
            onPress={() =>
              navigation.navigate('AddEditNavlogAction', {
                method: 'add',
                actionType: buttonActionLabel,
              })
            }
          >
            <Text color={Colors.white} fontWeight="medium">
              {t('new')} {buttonActionLabel}
            </Text>
          </Button>
          <Box w={ms(10)} />
          <Button
            bg={Colors.primary}
            flex="1"
            leftIcon={<Icon as={Ionicons} name="add" size="sm" />}
            maxH={ms(40)}
            onPress={() =>
              navigation.navigate('AddEditNavlogAction', {
                method: 'add',
                actionType: 'Cleaning',
              })
            }
          >
            <Text color={Colors.white} fontWeight="medium">
              {t('cleaning')}
            </Text>
          </Button>
        </HStack>
      </Shadow>
      <Modal
        animationPreset="slide"
        isOpen={confirmModal}
        px={ms(12)}
        size="full"
      >
        <Modal.Content>
          <Modal.Header>{t('confirmation')}</Modal.Header>
          <Text fontWeight="medium" mx={ms(12)} my={ms(20)}>
            {t('areYouSure')}
          </Text>
          <HStack>
            <Button
              bg={Colors.grey}
              flex="1"
              m={ms(12)}
              onPress={() => setConfirmModal(false)}
            >
              <Text color={Colors.disabled} fontWeight="medium">
                {t('cancel')}
              </Text>
            </Button>
            <Button
              bg={Colors.danger}
              flex="1"
              m={ms(12)}
              onPress={onStopAction}
            >
              <Text color={Colors.white} fontWeight="medium">
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
