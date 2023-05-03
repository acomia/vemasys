import React, {useEffect, useState, useRef} from 'react'
import {BackHandler, RefreshControl, TouchableOpacity} from 'react-native'
import {
  Box,
  Button,
  Divider,
  HStack,
  Icon,
  Image,
  Modal,
  ScrollView,
  Text,
  VStack,
  useToast,
} from 'native-base'
import {ms} from 'react-native-size-matters'
import DatePicker from 'react-native-date-picker'
import {
  NavigationProp,
  useIsFocused,
  useNavigation,
  useRoute,
} from '@react-navigation/native'
import Ionicons from 'react-native-vector-icons/Ionicons'
import _ from 'lodash'
import {useTranslation} from 'react-i18next'
import {Shadow} from 'react-native-shadow-2'

import {ActionCard, CommentCard, DatetimePickerList} from '../../components'
import {Colors} from '@bluecentury/styles'
import {Icons} from '@bluecentury/assets'
import {useEntity, usePlanning, useSettings, useMap} from '@bluecentury/stores'
import {
  formatLocationLabel,
  hasSelectedEntityUserPermission,
  ROLE_PERMISSION_NAVIGATION_LOG_ADD_COMMENT,
  titleCase,
} from '@bluecentury/constants'
import {LoadingAnimated, WarningAlert} from '@bluecentury/components'
import {Vemasys} from '@bluecentury/helpers'
import {RootStackParamList} from '@bluecentury/types/nav.types'
import {Contacts} from '@bluecentury/models'
import {CustomAlert} from '@bluecentury/components/custom-alert'

type Dates = {
  plannedETA: Date | undefined | StringOrNull
  captainDatetimeETA: Date | undefined | StringOrNull
  announcedDatetime: Date | undefined | StringOrNull
  arrivalDatetime: Date | undefined | StringOrNull
  terminalApprovedDeparture: Date | undefined | StringOrNull
  departureDatetime: Date | undefined | StringOrNull
}
const Details = () => {
  const {t} = useTranslation()
  const toast = useToast()
  const navigation = useNavigation<NavigationProp<RootStackParamList>>()
  const route = useRoute()
  const focused = useIsFocused()
  const isOnline = useSettings().isOnline
  const {
    isPlanningLoading,
    isPlanningDetailsLoading,
    isPlanningActionsLoading,
    isPlanningCommentsLoading,
    isPlanningRoutesLoading,
    navigationLogDetails,
    navigationLogComments,
    navigationLogActions,
    navigationLogRoutes,
    getNavigationLogDetails,
    getNavigationLogActions,
    getNavigationLogComments,
    getNavigationLogRoutes,
    getNavigationLogDocuments,
    updateNavlogDates,
    updateNavlogDatesSuccess,
    updateNavlogDatesFailed,
    updateNavlogDatesMessage,
    updateNavigationLogAction,
    isUpdateNavLogActionSuccess,
    isCreateNavLogActionSuccess,
    reset,
  } = usePlanning()
  const {
    selectedEntity,
    isLoadingEntityUsers,
    getLinkEntityInfo,
    linkEntity,
    commentsWaitingForUpload,
  } = useEntity()
  const {trackViewMode} = useMap()
  const {navlog, title}: any = route.params

  const [dates, setDates] = useState<Dates>({
    plannedETA: navigationLogDetails?.plannedEta,
    captainDatetimeETA: navigationLogDetails?.captainDatetimeEta,
    announcedDatetime: navigationLogDetails?.announcedDatetime,
    arrivalDatetime: navigationLogDetails?.arrivalDatetime,
    terminalApprovedDeparture: navigationLogDetails?.terminalApprovedDeparture,
    departureDatetime: navigationLogDetails?.departureDatetime,
  })
  const [didDateChange, setDidDateChange] = useState({
    Pln: {didUpdate: false},
    Eta: {didUpdate: false},
    Nor: {didUpdate: false},
    Doc: {didUpdate: false},
    Arr: {didUpdate: false},
    Dep: {didUpdate: false},
  })

  const [viewImg, setViewImg] = useState(false)
  const [selectedImg, setSelectedImg] = useState<ImageFile | any>({})
  const [selectedType, setSelectedType] = useState('')
  const [openDatePicker, setOpenDatePicker] = useState(false)
  const [activeActions, setActiveActions] = useState([])
  const [buttonActionLabel, setButtonActionLabel] = useState(' ')
  const [selectedAction, setSelectedAction] = useState<NavigationLogAction>({})
  const [confirmModal, setConfirmModal] = useState(false)
  const [leaveTabModal, setLeaveTabModal] = useState(false)
  const [buttonBackLeave, setButtonBackLeave] = useState(false)
  const [isOpenWarning, setIsOpenWarning] = useState(false)
  const hasAddCommentPermission = hasSelectedEntityUserPermission(
    selectedEntity,
    ROLE_PERMISSION_NAVIGATION_LOG_ADD_COMMENT
  )
  const isUnknownLocation = title === 'Unknown Location' ? true : false
  const unsavedChanges = Object.values(didDateChange).filter(
    date => date.didUpdate === true
  )
  const isDestinationVesselExist =
    navigationLogDetails?.link !== undefined &&
    navigationLogDetails?.link !== null
      ? true
      : false
  const warningRef = useRef<any>(null)

  useEffect(() => {
    navigation.getParent()?.setOptions({
      headerLeft: () => {
        return (
          <Box ml={ms(1)} mr={ms(20)}>
            <TouchableOpacity
              onPress={() => {
                if (unsavedChanges.length > 0) {
                  setButtonBackLeave(true)
                  setLeaveTabModal(true)
                } else {
                  navigation.goBack()
                }
              }}
            >
              <Ionicons
                color={Colors.black}
                name="arrow-back-outline"
                size={ms(25)}
              />
            </TouchableOpacity>
          </Box>
        )
      },
    })

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      () => {
        if (unsavedChanges.length > 0) {
          setButtonBackLeave(true)
          setLeaveTabModal(true)
          return true
        }
        return false
      }
    )

    return () => backHandler.remove()
  }, [navigation, unsavedChanges])

  useEffect(() => {
    if (!focused && unsavedChanges.length > 0) {
      setLeaveTabModal(true)
    }
    /* eslint-disable react-hooks/exhaustive-deps */
  }, [focused])

  useEffect(() => {
    getNavigationLogDetails(navlog?.id)
    getNavigationLogActions(navlog?.id)
    getNavigationLogComments(navlog?.id)
    getNavigationLogRoutes(navlog?.id)
    getNavigationLogDocuments(navlog?.id)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    const active = navigationLogActions?.filter(action => _.isNull(action?.end))
    setActiveActions(active)

    const updatedDates = {
      ...dates,
      plannedETA: navigationLogDetails?.plannedEta,
      captainDatetimeETA: navigationLogDetails?.captainDatetimeEta,
      announcedDatetime: navigationLogDetails?.announcedDatetime,
      arrivalDatetime:
        navigationLogDetails?.arrivalDatetime ||
        navigationLogDetails?.captainDatetimeEta,
      terminalApprovedDeparture:
        navigationLogDetails?.terminalApprovedDeparture,
      departureDatetime: navigationLogDetails?.departureDatetime,
    }

    if (navigationLogRoutes && !navigationLogDetails?.arrivalDatetime) {
      updatedDates.arrivalDatetime =
        navigationLogDetails?.announcedDatetime &&
        navigationLogDetails?.captainDatetimeEta
          ? navigationLogDetails?.captainDatetimeEta
          : navigationLogRoutes[navigationLogRoutes.length - 1]
              ?.estimatedArrival
    }

    setDates(updatedDates)

    if (
      navigationLogDetails?.bulkCargo?.some(cargo => cargo.isLoading === false)
    ) {
      setButtonActionLabel('Unloading')
    } else {
      setButtonActionLabel('Loading')
    }

    if (
      navigationLogDetails?.link !== undefined &&
      navigationLogDetails?.link !== null
    ) {
      const linkEntityU =
        navigationLogDetails?.link?.navigationLogExploitationVessels.filter(
          entity => entity.id !== navigationLogDetails.id
        )[0]
      if (linkEntityU?.id) {
        getLinkEntityInfo(
          linkEntityU?.exploitationVessel?.entity?.id.toString()
        )
      }
    }
  }, [
    navigationLogActions,
    navigationLogDetails,
    isCreateNavLogActionSuccess,
    navigationLogRoutes,
  ])

  useEffect(() => {
    if (updateNavlogDatesSuccess === 'SUCCESS' && focused) {
      showToast('Updates saved.', 'success')
    }
    if (updateNavlogDatesFailed === 'FAILED') {
      showToast(updateNavlogDatesMessage, 'failed')
    }
    if (isUpdateNavLogActionSuccess && focused) {
      showToast('Action ended.', 'success')
    }
  }, [
    updateNavlogDatesSuccess,
    updateNavlogDatesFailed,
    updateNavlogDatesMessage,
    isUpdateNavLogActionSuccess,
  ])

  const onSelectImage = (image: ImageFile) => {
    setViewImg(true)
    setSelectedImg(image)
  }

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
        res === 'success' ? onSuccess() : reset()
      },
    })
  }

  const onSuccess = () => {
    setDidDateChange({
      ...didDateChange,
      Pln: {didUpdate: false},
      Eta: {didUpdate: false},
      Nor: {didUpdate: false},
      Doc: {didUpdate: false},
      Arr: {didUpdate: false},
      Dep: {didUpdate: false},
    })
    onPullToReload()
    reset()
  }

  const handleOnSaveDateUpdates = () => {
    updateNavlogDates(navlog?.id, dates)
  }

  const onDatesChange = (date: Date) => {
    const formattedDate = Vemasys.formatDate(date)
    switch (selectedType) {
      case 'PLN':
        setDates({...dates, plannedETA: formattedDate})
        setDidDateChange({...didDateChange, Pln: {didUpdate: true}})
        return
      case 'ETA':
        setDates({
          ...dates,
          captainDatetimeETA: formattedDate,
        })
        setDidDateChange({...didDateChange, Eta: {didUpdate: true}})
        return
      case 'NOR':
        setDates({...dates, announcedDatetime: formattedDate})
        setDidDateChange({...didDateChange, Nor: {didUpdate: true}})
        return
      case 'ARR':
        setDates({...dates, arrivalDatetime: formattedDate})
        setDidDateChange({...didDateChange, Arr: {didUpdate: true}})
        return
      case 'DOC':
        setDates({...dates, terminalApprovedDeparture: formattedDate})
        setDidDateChange({...didDateChange, Doc: {didUpdate: true}})
        return
      case 'DEP':
        setDates({...dates, departureDatetime: formattedDate})
        setDidDateChange({...didDateChange, Dep: {didUpdate: true}})
        return
    }
  }

  const renderLocation = () => (
    <>
      <HStack alignItems="center">
        <Image
          alt="navglog-cargo-img"
          source={isUnknownLocation ? Icons.map_marker_question : Icons.cargo}
        />
        <Text fontSize={ms(16)} fontWeight="medium" ml={ms(20)}>
          {formatLocationLabel(navigationLogDetails?.location)}
        </Text>
      </HStack>

      {isDestinationVesselExist ? (
        <>
          <Text color={Colors.disabled} fontWeight="medium" mt={ms(10)}>
            Destination vessel
          </Text>
          <HStack
            alignItems="center"
            bg={Colors.light_grey}
            borderRadius={ms(5)}
            mt={ms(8)}
            p={ms(6)}
          >
            <Image
              alt="navglog-ship"
              source={Icons.ship}
              tintColor={Colors.azure}
            />
            <Text
              color={Colors.text}
              fontSize={16}
              fontWeight="medium"
              ml={ms(10)}
            >
              {linkEntity?.name}
            </Text>
          </HStack>
        </>
      ) : null}
    </>
  )

  const renderPlanningDates = () => (
    <Box>
      <DatetimePickerList
        date={dates.plannedETA}
        // locked={isUnknownLocation ? true : navigationLogDetails?.locked}
        locked={true}
        readOnly={true}
        title="Planned"
        onChangeDate={() => {
          setSelectedType('PLN')
          setOpenDatePicker(true)
        }}
        onClearDate={() => {
          setDidDateChange({
            ...didDateChange,
            Pln: {didUpdate: _.isNull(dates.plannedETA) ? false : true},
          })
          setDates({...dates, plannedETA: null})
        }}
      />
      <DatetimePickerList
        date={dates.captainDatetimeETA}
        locked={isUnknownLocation ? true : navigationLogDetails?.locked}
        title="ETA"
        onChangeDate={() => {
          setSelectedType('ETA')
          setOpenDatePicker(true)
        }}
        onClearDate={() => {
          setDidDateChange({
            ...didDateChange,
            Eta: {
              didUpdate: _.isNull(dates.captainDatetimeETA) ? false : true,
            },
          })
          setDates({
            ...dates,
            captainDatetimeETA: null,
          })
        }}
      />
    </Box>
  )

  const renderAnnouncingAndArrivalDates = () => {
    return (
      <Box>
        <DatetimePickerList
          date={dates.announcedDatetime}
          locked={isUnknownLocation ? true : navigationLogDetails?.locked}
          title="Notice of Readiness"
          onChangeDate={() => {
            setSelectedType('NOR')
            setOpenDatePicker(true)
          }}
          onClearDate={() => {
            setDidDateChange({
              ...didDateChange,
              Nor: {
                didUpdate: _.isNull(dates.announcedDatetime) ? false : true,
              },
            })
            setDates({
              ...dates,
              announcedDatetime: null,
            })
          }}
        />

        <DatetimePickerList
          date={dates.arrivalDatetime}
          // iconName={trackViewMode ? 'info-circle' : null}
          locked={isUnknownLocation ? true : navigationLogDetails?.locked}
          title="Arrival"
          onChangeDate={() => {
            setSelectedType('ARR')
            setIsOpenWarning(true)
            // setOpenDatePicker(true)
          }}
          onClearDate={() => {
            setDidDateChange({
              ...didDateChange,
              Arr: {
                didUpdate: _.isNull(dates.arrivalDatetime) ? false : true,
              },
            })
            setDates({
              ...dates,
              arrivalDatetime: null,
            })
          }}
        />
      </Box>
    )
  }

  const renderDepartureDates = () => (
    <Box>
      <DatetimePickerList
        date={dates.terminalApprovedDeparture}
        locked={isUnknownLocation ? true : navigationLogDetails?.locked}
        title="Docs on Board"
        onChangeDate={() => {
          setSelectedType('DOC')
          setOpenDatePicker(true)
        }}
        onClearDate={() => {
          setDidDateChange({
            ...didDateChange,
            Doc: {
              didUpdate: _.isNull(dates.terminalApprovedDeparture)
                ? false
                : true,
            },
          })
          setDates({
            ...dates,
            terminalApprovedDeparture: null,
          })
        }}
      />

      <DatetimePickerList
        date={dates.departureDatetime}
        // iconName={trackViewMode ? 'info-circle' : null}
        locked={isUnknownLocation ? true : navigationLogDetails?.locked}
        title="Departure"
        onChangeDate={() => {
          setSelectedType('DEP')
          setIsOpenWarning(true)
          // setOpenDatePicker(true)
        }}
        onClearDate={() => {
          setDidDateChange({
            ...didDateChange,
            Dep: {
              didUpdate: _.isNull(dates.departureDatetime) ? false : true,
            },
          })
          setDates({
            ...dates,
            departureDatetime: null,
          })
        }}
      />
    </Box>
  )

  const renderNavlogActions = () => (
    <Box>
      {activeActions?.map((action: any, index) => (
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
      ))}
      <HStack mt={ms(15)}>
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
    </Box>
  )

  const renderContactInformation = (contact: Contacts, index: number) => {
    return (
      <HStack
        key={index}
        alignItems="center"
        bg={Colors.white}
        borderColor={Colors.light}
        borderRadius={ms(5)}
        borderWidth={1}
        justifyContent="space-between"
        mb={ms(10)}
        p={ms(10)}
        shadow={3}
      >
        <HStack alignItems="center">
          <Image
            alt="charter-contact"
            resizeMode="contain"
            source={Icons.user}
            tintColor={Colors.azure}
          />
          <Box ml={5}>
            <Text bold>{contact?.name}</Text>
            {contact?.email ? <Text>{contact?.email}</Text> : null}
          </Box>
        </HStack>
        <Text>{contact?.phoneNumber}</Text>
      </HStack>
    )
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

  const onCancelUnsavedChanges = () => {
    setDates({
      ...dates,
      plannedETA: navigationLogDetails?.plannedEta,
      captainDatetimeETA: navigationLogDetails?.captainDatetimeEta,
      announcedDatetime: navigationLogDetails?.announcedDatetime,
      terminalApprovedDeparture:
        navigationLogDetails?.terminalApprovedDeparture,
      arrivalDatetime:
        navigationLogDetails?.arrivalDatetime ||
        navigationLogDetails?.captainDatetimeEta,
      departureDatetime: navigationLogDetails?.departureDatetime,
    })
    setDidDateChange({
      ...didDateChange,
      Pln: {didUpdate: false},
      Eta: {didUpdate: false},
      Nor: {didUpdate: false},
      Doc: {didUpdate: false},
      Arr: {didUpdate: false},
      Dep: {didUpdate: false},
    })
  }

  const onProceedToNextTab = () => {
    setLeaveTabModal(false)
    setDates({
      ...dates,
      plannedETA: navigationLogDetails?.plannedEta,
      captainDatetimeETA: navigationLogDetails?.captainDatetimeEta,
      announcedDatetime: navigationLogDetails?.announcedDatetime,
      terminalApprovedDeparture:
        navigationLogDetails?.terminalApprovedDeparture,
      arrivalDatetime:
        navigationLogDetails?.arrivalDatetime ||
        navigationLogDetails?.captainDatetimeEta,

      departureDatetime: navigationLogDetails?.departureDatetime,
    })
    setDidDateChange({
      ...didDateChange,
      Pln: {didUpdate: false},
      Eta: {didUpdate: false},
      Nor: {didUpdate: false},
      Doc: {didUpdate: false},
      Arr: {didUpdate: false},
      Dep: {didUpdate: false},
    })
    if (buttonBackLeave) {
      setButtonBackLeave(false)
      navigation.goBack()
    }
  }

  const onPullToReload = () => {
    getNavigationLogDetails(navlog.id)
    getNavigationLogActions(navlog?.id)
    getNavigationLogComments(navlog.id)
    getNavigationLogRoutes(navlog?.id)
    getNavigationLogDocuments(navlog?.id)
  }

  if (
    isPlanningLoading ||
    isPlanningDetailsLoading ||
    isPlanningActionsLoading ||
    isPlanningCommentsLoading ||
    isLoadingEntityUsers
  ) {
    return <LoadingAnimated />
  }
  return (
    <Box flex="1">
      <ScrollView
        refreshControl={
          <RefreshControl
            refreshing={
              isPlanningLoading ||
              isPlanningDetailsLoading ||
              isPlanningActionsLoading ||
              isPlanningCommentsLoading
            }
            onRefresh={onPullToReload}
          />
        }
        bg={Colors.white}
        contentContainerStyle={{flexGrow: 1, paddingBottom: 30}}
        px={ms(12)}
        py={ms(20)}
        scrollEventThrottle={16}
      >
        {/* Location Section */}
        <Text bold color={Colors.azure} fontSize={ms(20)}>
          Location
        </Text>
        <Divider bg={Colors.light} h={ms(2)} my={ms(8)} />
        {renderLocation()}

        {/* End of Location Section */}
        {/* Planning dates Section */}
        <Text bold color={Colors.azure} fontSize={ms(20)} mt={ms(20)}>
          Planning
        </Text>
        <Divider bg={Colors.light} h={ms(2)} my={ms(8)} />
        {renderPlanningDates()}
        {/* End of Planning dates Section */}
        {/* Announcing&Arrival dates Section */}
        <Text bold color={Colors.azure} fontSize={ms(20)} mt={ms(10)}>
          Announcing and Arrival
        </Text>
        <Divider bg={Colors.light} h={ms(2)} my={ms(8)} />
        {renderAnnouncingAndArrivalDates()}
        {/* End of Announcing&Arrival dates Section */}
        {/* Actions Section */}
        <Text bold color={Colors.azure} fontSize={ms(20)} mt={ms(10)}>
          Actions
        </Text>
        <Divider bg={Colors.light} h={ms(2)} my={ms(8)} />
        {renderNavlogActions()}
        {/* End of Actions Section */}
        {/* Announcing&Arrival dates Section */}
        <Text bold color={Colors.azure} fontSize={ms(20)} mt={ms(20)}>
          Departure
        </Text>
        <Divider bg={Colors.light} h={ms(2)} my={ms(8)} />
        {renderDepartureDates()}
        {/* End of Announcing&Arrival dates Section */}
        {/* Contact Information Section */}
        {isUnknownLocation ? null : (
          <>
            <Text bold color={Colors.azure} fontSize={ms(20)} mt={ms(20)}>
              {t('contactInformation')}
            </Text>
            <Box my={ms(15)}>
              {navigationLogDetails?.contacts?.length > 0 ? (
                navigationLogDetails?.contacts?.map(
                  (contact: any, index: number) =>
                    renderContactInformation(contact, index)
                )
              ) : (
                <Box
                  bg={Colors.white}
                  borderColor={Colors.light}
                  borderRadius={5}
                  borderWidth={1}
                  mt={ms(10)}
                  p={ms(16)}
                  shadow={2}
                >
                  <Text>{t('noContactInformation')}</Text>
                </Box>
              )}
            </Box>
          </>
        )}

        {/* Comments Section */}
        <HStack alignItems="center" mt={ms(20)}>
          <Text bold color={Colors.azure} fontSize={ms(20)}>
            {t('comments')}
          </Text>
          {navigationLogComments?.length > 0 ? (
            <Box
              bg={Colors.azure}
              borderRadius={ms(20)}
              height={ms(22)}
              ml={ms(10)}
              width={ms(22)}
            >
              <Text bold color={Colors.white} textAlign="center">
                {navigationLogComments?.length}
              </Text>
            </Box>
          ) : null}
        </HStack>

        {navigationLogComments?.map((comment, index) => {
          const descriptionText = comment.description.match(/^[^-<]*/)
          return (
            <CommentCard
              key={index}
              comment={comment}
              commentDescription={descriptionText}
              onCommentPress={() =>
                navigation.navigate('AddEditComment', {
                  comment: comment,
                  method: 'edit',
                  routeFrom: 'Planning',
                })
              }
              onCommentImagePress={(file: ImageFile) => onSelectImage(file)}
            />
          )
        })}
        {commentsWaitingForUpload.length
          ? commentsWaitingForUpload.map((comment, index) => {
              return (
                <CommentCard
                  key={index}
                  comment={comment.commentArg}
                  commentDescription={comment.description}
                  images={comment.imgFile}
                  onCommentImagePress={() => {}}
                  onCommentPress={() => {}}
                />
              )
            })
          : null}
        {hasAddCommentPermission && (
          <Button
            bg={Colors.primary}
            leftIcon={<Icon as={Ionicons} name="add" size="sm" />}
            mb={ms(20)}
            mt={ms(20)}
            onPress={() =>
              navigation.navigate('AddEditComment', {
                method: 'add',
                routeFrom: 'Planning',
                navlogId: navlog.id,
              })
            }
          >
            {t('addComment')}
          </Button>
        )}

        <DatePicker
          modal
          date={new Date()}
          mode="datetime"
          open={openDatePicker}
          onCancel={() => {
            setOpenDatePicker(false)
          }}
          onConfirm={date => {
            setOpenDatePicker(false)
            onDatesChange(date)
          }}
        />
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
        {/* this is not used but can be use in the future */}
        {/* start */}
        <Modal
          animationPreset="slide"
          isOpen={leaveTabModal}
          px={ms(12)}
          size="full"
        >
          <Modal.Content>
            <Modal.Header>{t('confirmation')}</Modal.Header>
            <Text fontWeight="medium" mx={ms(12)} my={ms(20)}>
              {t('unsavedChangesProceedConfirmation')}
            </Text>
            <HStack>
              <Button
                bg={Colors.grey}
                flex="1"
                m={ms(12)}
                onPress={() => {
                  setLeaveTabModal(false)
                  if (!buttonBackLeave) {
                    navigation.goBack()
                  }
                  setButtonBackLeave(false)
                }}
              >
                <Text color={Colors.disabled} fontWeight="medium">
                  {t('no')}
                </Text>
              </Button>
              <Button
                bg={Colors.danger}
                flex="1"
                m={ms(12)}
                onPress={onProceedToNextTab}
              >
                <Text color={Colors.white} fontWeight="medium">
                  {t('yes')}
                </Text>
              </Button>
            </HStack>
          </Modal.Content>
        </Modal>
      </ScrollView>
      {unsavedChanges.length > 0 ? (
        <Box bg={Colors.white} position="relative">
          <Shadow
            viewStyle={{
              width: '100%',
            }}
            distance={25}
          >
            <HStack>
              <Button
                colorScheme="muted"
                flex="1"
                m={ms(16)}
                variant="ghost"
                onPress={onCancelUnsavedChanges}
              >
                {t('cancel')}
              </Button>
              <Button
                bg={Colors.primary}
                flex="1"
                m={ms(16)}
                onPress={handleOnSaveDateUpdates}
              >
                {t('save')}
              </Button>
            </HStack>
          </Shadow>
        </Box>
      ) : null}

      <Modal isOpen={viewImg} size="full" onClose={() => setViewImg(false)}>
        <Modal.Content>
          <Image
            alt="file-preview"
            h="100%"
            resizeMode="contain"
            source={{uri: selectedImg.uri}}
            w="100%"
          />
        </Modal.Content>
      </Modal>
      <WarningAlert
        alert={{
          leastDestructiveRef: warningRef,
          isOpen: isOpenWarning,
          onClose: () => setIsOpenWarning(false),
        }}
        buttons={[
          {
            variant: 'link',
            _text: {
              color: Colors.disabled,
              fontWeight: 'bold',
            },
            children: t('cancel'),
            onPress: () => setIsOpenWarning(false),
          },
          {
            _text: {
              fontWeight: 'bold',
            },
            backgroundColor: Colors.offlineWarning,
            children: t('yes'),
            onPress: () => {
              setIsOpenWarning(false)
              setOpenDatePicker(true)
            },
          },
        ]}
        content={
          <VStack space={ms(10)}>
            <Text>
              {t('overrideWarning')}:{' '}
              <Text color={Colors.azure} fontSize={'md'}>
                {title}
              </Text>
            </Text>
            <HStack>
              <Box bgColor={Colors.danger} height={'100%'} width={ms(10)} />
              <Box bgColor={Colors.light_red} px={ms(5)} py={ms(5)}>
                <Text color={Colors.dangerDarker}>
                  {t('overRideWarningSub2')}
                </Text>
              </Box>
            </HStack>
          </VStack>
        }
        title={
          <Text color={Colors.danger} fontSize="xl" fontWeight={'bold'}>
            {t('warning') as string}
          </Text>
        }
      />
    </Box>
  )
}

export default Details
