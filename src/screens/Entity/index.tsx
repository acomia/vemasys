import React, {useCallback, useEffect, useRef, useState} from 'react'
import {
  Box,
  FlatList,
  Heading,
  Divider,
  Button,
  Image,
  HStack,
  Text,
  Modal,
  useToast,
} from 'native-base'
import {CommonActions, useFocusEffect} from '@react-navigation/native'
import {NativeStackScreenProps} from '@react-navigation/native-stack'
import {ms} from 'react-native-size-matters'
import {useEntity, useAuth, useSettings} from '@bluecentury/stores'
import {Icons} from '@bluecentury/assets'
import {Colors} from '@bluecentury/styles'
import {EntityCard, LoadingAnimated} from '@bluecentury/components'
import {Shadow} from 'react-native-shadow-2'
import {resetAllStates} from '@bluecentury/utils'
import {useSafeAreaInsets} from 'react-native-safe-area-context'
import {CustomAlert} from '@bluecentury/components/custom-alert'
import {EntityUser} from '@bluecentury/models'

type Props = NativeStackScreenProps<RootStackParamList>

export default function Entity({route, navigation}: Props) {
  const toast = useToast()
  const insets = useSafeAreaInsets()
  const paddingTop = route.name === 'ChangeRole' ? 2 : insets.top
  const borderTopRadius = route.name === 'ChangeRole' ? '3xl' : 0
  const {
    entityUsers,
    entityUserId,
    isLoadingEntityUsers,
    isLoadingPendingRoles,
    selectedVessel,
    getUserInfo,
    getEntityUsers,
    selectEntityUser,
    getRoleForAccept,
    pendingRoles,
    updatePendingRole,
    acceptRoleStatus,
  } = useEntity()
  const [entityItems, setEntityItems] = useState<EntityUser[]>()
  const {logout, isLoggingOut} = useAuth()
  const {isMobileTracking} = useSettings()
  const [isOpenLogoutAlert, setIsOpenLogoutAlert] = useState(false)
  const [isOpenAlertIsMobileTracking, setIsOpenAlertIsMobileTracking] =
    useState(false)
  const [confirmModal, setConfirmModal] = useState(false)
  const [acceptRoleData, setAcceptRoleData] = useState({id: '', accept: false})
  const logoutCancelRef = useRef<any>(null)

  useFocusEffect(
    useCallback(() => {
      getUserInfo()
      getEntityUsers()
      getRoleForAccept()
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
  )

  useEffect(() => {
    let uniqPendingRoles: any[] = []
    if (pendingRoles) {
      uniqPendingRoles = pendingRoles.filter(
        pr => !entityUsers.some(eu => pr.entity.id === eu.entity.id)
      )
    }
    if (typeof entityUserId === 'undefined') {
      const entities = [...uniqPendingRoles, ...entityUsers]
      setEntityItems(entities)
      return
    }
    const first = entityUsers.filter(e => e.id === parseInt(entityUserId))
    const rest = entityUsers.filter(e => e.id !== parseInt(entityUserId))
    const entities = [...uniqPendingRoles, ...first, ...rest]
    setEntityItems(entities)
  }, [pendingRoles, entityUsers, entityUserId])

  useEffect(() => {
    if (acceptRoleStatus === 'SUCCESS') {
      showToast('Role accepted.', 'success')
    }
    if (acceptRoleStatus === 'REJECTED') {
      showToast('Role rejected.', 'success')
    }
    if (acceptRoleStatus === 'FAILED') {
      showToast('Role failed.', 'failed')
    }
  }, [acceptRoleStatus])

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
        res === 'success' ? onSuccess() : null
      },
    })
  }

  const onSuccess = () => {
    useEntity.setState({acceptRoleStatus: ''})
    onPressRefresh()
  }

  const onSelectEntityUser = (entity: any) => {
    if (isMobileTracking) {
      setIsOpenAlertIsMobileTracking(true)
      return
    }
    if (entity?.hasUserAccepted !== undefined) {
    } else {
      selectEntityUser(entity)
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{name: 'Main'}],
        })
      )
    }
  }

  const onPressRefresh = () => {
    if (!isLoadingEntityUsers || !isLoadingPendingRoles) {
      getUserInfo()
      getEntityUsers()
      getRoleForAccept()
    }
  }

  const handleOnPressLogout = () => {
    if (isMobileTracking) {
      setIsOpenAlertIsMobileTracking(true)
      return
    }
    setIsOpenLogoutAlert(true)
  }

  const handleOnPressYesLogout = () => {
    resetAllStates()
    logout()
  }

  const onAcceptRoleConfirm = (id: string, accept: boolean) => {
    setAcceptRoleData({...acceptRoleData, id: id, accept: accept})
    setConfirmModal(true)
  }

  const onAcceptDeclineRole = () => {
    setConfirmModal(false)
    updatePendingRole(acceptRoleData.id, acceptRoleData.accept)
  }

  return (
    <Box flex="1" bg={Colors.light} pt={paddingTop}>
      <Box
        bg={Colors.white}
        flex="1"
        pt={ms(20)}
        px={ms(20)}
        borderTopRadius={borderTopRadius}
      >
        <HStack justifyContent="space-between" justifyItems="center">
          <Heading fontSize="xl" pb="2">
            Roles
          </Heading>
          <Button variant="link" p={0} m={0} onPress={onPressRefresh}>
            Click to Refresh
          </Button>
        </HStack>
        <Divider mb="5" />
        {isLoadingEntityUsers || isLoadingPendingRoles ? (
          <LoadingAnimated />
        ) : (
          <FlatList
            data={entityItems}
            renderItem={({item}: any) => {
              return (
                <EntityCard
                  item={item}
                  selected={item.id === entityUserId}
                  onPress={() => onSelectEntityUser(item)}
                  onPressAcceptPendingRole={(id, accept) =>
                    onAcceptRoleConfirm(id, accept)
                  }
                />
              )
            }}
            keyExtractor={(item: any) => `entity-${item?.id}`}
            // eslint-disable-next-line react-native/no-inline-styles
            contentContainerStyle={{paddingBottom: 150}}
            showsVerticalScrollIndicator={false}
          />
        )}
      </Box>
      <Box bg={Colors.white} position="absolute" left={0} right={0} bottom={0}>
        <Shadow
          distance={25}
          // eslint-disable-next-line react-native/no-inline-styles
          viewStyle={{
            width: '100%',
          }}
        >
          <Box p={ms(20)} pb={ms(insets.bottom === 0 ? 20 : insets.bottom)}>
            <Button
              bg={Colors.danger}
              _light={{
                _pressed: {
                  bg: Colors.dangerDarker,
                },
              }}
              isLoading={isLoggingOut}
              _loading={{
                opacity: 0.5,
                bg: Colors.danger,
              }}
              _spinner={{
                size: ms(20),
                color: Colors.white,
              }}
              isLoadingText="Logging out"
              leftIcon={
                <Image
                  alt="logout-img"
                  source={Icons.logout}
                  resizeMode="contain"
                  size={ms(20)}
                />
              }
              onPress={handleOnPressLogout}
            >
              Log out
            </Button>
          </Box>
        </Shadow>
      </Box>
      <CustomAlert
        title="Logout"
        content="Are you sure you want to logout?"
        alert={{
          leastDestructiveRef: logoutCancelRef,
          isOpen: isOpenLogoutAlert,
          onClose: () => setIsOpenLogoutAlert(false),
        }}
        buttons={[
          {
            variant: 'link',
            _text: {
              color: Colors.black,
            },
            children: 'Yes',
            onPress: handleOnPressYesLogout,
          },
          {
            colorScheme: 'danger',
            children: 'No',
            onPress: () => setIsOpenLogoutAlert(false),
          },
        ]}
      />
      <CustomAlert
        title="Tracking"
        content={`Device is currently sending GPS Data for ${
          selectedVessel && selectedVessel?.alias
        }. You will have to disable it in order to proceed with your latest action.`}
        alert={{
          leastDestructiveRef: logoutCancelRef,
          isOpen: isOpenAlertIsMobileTracking,
          onClose: () => setIsOpenAlertIsMobileTracking(false),
        }}
        buttons={[
          {
            variant: 'link',
            _text: {
              color: Colors.black,
            },
            children: 'OK',
            onPress: () => setIsOpenAlertIsMobileTracking(false),
          },
        ]}
      />
      <Modal
        isOpen={confirmModal}
        size="full"
        px={ms(12)}
        animationPreset="slide"
      >
        <Modal.Content>
          <Modal.Header>Confirmation</Modal.Header>
          <Text my={ms(20)} mx={ms(12)} fontWeight="medium">
            Are you sure you want to{' '}
            {acceptRoleData.accept ? 'accept' : 'decline'} this role?
          </Text>
          <HStack>
            <Button
              flex="1"
              m={ms(12)}
              bg={Colors.grey}
              onPress={() => setConfirmModal(false)}
              _light={{
                _text: {
                  fontWeight: 'medium',
                  color: Colors.disabled,
                },
              }}
            >
              Cancel
            </Button>
            <Button
              flex="1"
              m={ms(12)}
              bg={acceptRoleData.accept ? Colors.secondary : Colors.danger}
              onPress={onAcceptDeclineRole}
              _light={{
                _text: {
                  fontWeight: 'medium',
                  color: Colors.white,
                },
              }}
            >
              {acceptRoleData.accept ? 'Accept' : 'Decline'}
            </Button>
          </HStack>
        </Modal.Content>
      </Modal>
    </Box>
  )
}
