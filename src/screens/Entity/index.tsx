import React, {useEffect, useLayoutEffect, useRef, useState} from 'react'
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
import {CommonActions, useIsFocused} from '@react-navigation/native'
import {NativeStackScreenProps} from '@react-navigation/native-stack'
import {ms} from 'react-native-size-matters'
import {useEntity, useAuth, useSettings} from '@bluecentury/stores'
import {Icons} from '@bluecentury/assets'
import {Colors} from '@bluecentury/styles'
import {
  EntityCard,
  LoadingAnimated,
  NoInternetConnectionMessage,
} from '@bluecentury/components'
import {Shadow} from 'react-native-shadow-2'
import {resetAllStates} from '@bluecentury/utils'
import {useSafeAreaInsets} from 'react-native-safe-area-context'
import {CustomAlert} from '@bluecentury/components/custom-alert'
import {EntityUser} from '@bluecentury/models'
import {useTranslation} from 'react-i18next'
import {RootStackParamList} from '@bluecentury/types/nav.types'
import {StyleSheet} from 'react-native'

type Props = NativeStackScreenProps<RootStackParamList>

export default function Entity({route, navigation}: Props) {
  const {t} = useTranslation()
  const toast = useToast()
  const focused = useIsFocused()
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
    entityId,
  } = useEntity()
  const [entityItems, setEntityItems] = useState<EntityUser[]>()
  const {logout, isLoggingOut, token} = useAuth()
  const {isMobileTracking, setIsMobileTracking} = useSettings()
  const [isOpenLogoutAlert, setIsOpenLogoutAlert] = useState(false)
  const [isOpenAlertIsMobileTracking, setIsOpenAlertIsMobileTracking] =
    useState(false)
  const [confirmModal, setConfirmModal] = useState(false)
  const [acceptRoleData, setAcceptRoleData] = useState({id: '', accept: false})
  const logoutCancelRef = useRef<any>(null)

  useLayoutEffect(() => {
    getUserInfo()
    getRoleForAccept()
    getEntityUsers()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [focused])

  useEffect(() => {
    let uniqPendingRoles: any[] = []
    if (pendingRoles) {
      uniqPendingRoles = pendingRoles?.filter(
        pr => !entityUsers.some(eu => pr.entity.id === eu.entity.id)
      )
    }
    if (typeof entityUserId === 'undefined') {
      const entities = [...uniqPendingRoles, ...entityUsers]
      setEntityItems(entities)
      return
    }
    const first = entityUsers.filter(
      e => e.id === parseInt(entityUserId as string)
    )
    const rest = entityUsers.filter(
      e => e.id !== parseInt(entityUserId as string)
    )
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [acceptRoleStatus])

  useEffect(() => {
    if (!token) {
      navigation.navigate('Login')
      return
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token])

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
        res === 'success' ? onSuccess() : null
      },
    })
  }

  const onSuccess = () => {
    useEntity.setState({acceptRoleStatus: ''})
    onPressRefresh()
  }

  const onSelectEntityUser = (entity: EntityUser) => {
    if (isMobileTracking && entityId) {
      setIsOpenAlertIsMobileTracking(true)
      return
    }
    if (isMobileTracking && !entityId) {
      setIsMobileTracking(false)
    }

    if (!entity?.hasUserAccepted) {
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
    setIsOpenLogoutAlert(false)
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
    <Box bg={Colors.light} flex="1" pt={paddingTop}>
      <NoInternetConnectionMessage />
      <Box
        bg={Colors.white}
        borderTopRadius={borderTopRadius}
        flex="1"
        pt={ms(20)}
        px={ms(20)}
      >
        <HStack justifyContent="space-between" justifyItems="center">
          <Heading fontSize="xl" pb="2">
            {t('roles')}
          </Heading>
          <Button m={0} p={0} variant="link" onPress={onPressRefresh}>
            {t('clickToRefresh')}
          </Button>
        </HStack>
        <Divider mb="5" />
        {isLoadingEntityUsers || isLoadingPendingRoles ? (
          <LoadingAnimated />
        ) : (
          <FlatList
            ListEmptyComponent={() => (
              <Text
                bold
                color={Colors.azure}
                fontSize={ms(13)}
                mt={10}
                textAlign="center"
              >
                No linked entities yet, contact Administrator or wait for
                requests to be accepted.
              </Text>
            )}
            renderItem={({item}) => {
              return (
                <EntityCard
                  item={item}
                  selected={item.id === entityUserId}
                  onPressAcceptPendingRole={(id, accept) =>
                    onAcceptRoleConfirm(id, accept)
                  }
                  onPress={() => onSelectEntityUser(item)}
                />
              )
            }}
            contentContainerStyle={styles.flatListContentContainerStyle}
            data={entityItems}
            keyExtractor={(item: EntityUser) => `entity-${item?.id}`}
            showsVerticalScrollIndicator={false}
          />
        )}
      </Box>
      <Box bg={Colors.white} bottom={0} left={0} position="absolute" right={0}>
        <Shadow distance={25} viewStyle={styles.shadow}>
          <Box p={ms(20)} pb={ms(insets.bottom === 0 ? 20 : insets.bottom)}>
            <Button
              _light={{
                _pressed: {
                  bg: Colors.dangerDarker,
                },
              }}
              _loading={{
                opacity: 0.5,
                bg: Colors.danger,
              }}
              _spinner={{
                size: ms(20),
                color: Colors.white,
              }}
              leftIcon={
                <Image
                  alt="logout-img"
                  resizeMode="contain"
                  size={ms(20)}
                  source={Icons.logout}
                />
              }
              bg={Colors.danger}
              isLoading={isLoggingOut}
              isLoadingText="Logging out"
              onPress={handleOnPressLogout}
            >
              {t('logOut')}
            </Button>
          </Box>
        </Shadow>
      </Box>
      <CustomAlert
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
            children: t('yes'),
            onPress: handleOnPressYesLogout,
          },
          {
            colorScheme: 'danger',
            children: t('no'),
            onPress: () => setIsOpenLogoutAlert(false),
          },
        ]}
        content={t('logoutConfirm')}
        title={t('logoutOneWord') as string}
      />
      <CustomAlert
        alert={{
          leastDestructiveRef: logoutCancelRef,
          isOpen: isOpenAlertIsMobileTracking,
          onClose: () => setIsOpenAlertIsMobileTracking(false),
        }}
        buttons={[
          {
            colorScheme: 'info',
            _text: {
              color: Colors.white,
            },
            width: ms(60),
            children: t('OK'),
            onPress: () => setIsOpenAlertIsMobileTracking(false),
          },
        ]}
        content={`${t('sendingGPSDataFor')} ${
          selectedVessel && selectedVessel?.alias
        } ${t('requiredTurnOffGPS')}`}
        title={t('tracking') as string}
      />
      <Modal
        animationPreset="slide"
        isOpen={confirmModal}
        px={ms(12)}
        size="full"
      >
        <Modal.Content>
          <Modal.Header>Confirmation</Modal.Header>
          <Text fontWeight="medium" mx={ms(12)} my={ms(20)}>
            Are you sure you want to{' '}
            {acceptRoleData.accept ? 'accept' : 'decline'} this role?
          </Text>
          <HStack>
            <Button
              _light={{
                _text: {
                  fontWeight: 'medium',
                  color: Colors.disabled,
                },
              }}
              bg={Colors.grey}
              flex="1"
              m={ms(12)}
              onPress={() => setConfirmModal(false)}
            >
              Cancel
            </Button>
            <Button
              _light={{
                _text: {
                  fontWeight: 'medium',
                  color: Colors.white,
                },
              }}
              bg={acceptRoleData.accept ? Colors.secondary : Colors.danger}
              flex="1"
              m={ms(12)}
              onPress={onAcceptDeclineRole}
            >
              {acceptRoleData.accept ? 'Accept' : 'Decline'}
            </Button>
          </HStack>
        </Modal.Content>
      </Modal>
    </Box>
  )
}

const styles = StyleSheet.create({
  flatListContentContainerStyle: {
    paddingBottom: 150,
  },
  shadow: {
    width: '100%',
  },
})
