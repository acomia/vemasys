import React, {useEffect} from 'react'
import {View, SectionList, Dimensions, RefreshControl} from 'react-native'
import {
  Box,
  Image,
  Divider,
  Flex,
  HStack,
  Text,
  VStack,
  Center,
} from 'native-base'
import {ms} from 'react-native-size-matters'
import moment from 'moment'
import Icon from 'react-native-vector-icons/FontAwesome5'
import {Icons, Animated} from '@bluecentury/assets'
import {useNotif, useEntity} from '@bluecentury/stores'
import {FleetHeader, LoadingAnimated} from '@bluecentury/components'
import {ENTITY_TYPE_EXPLOITATION_GROUP} from '@bluecentury/constants'

const screenWidth = Dimensions.get('screen').width

export default function Notification() {
  const {entityType, entityUsers, selectFleetVessel, vesselId} = useEntity()
  const {isLoadingNotification, notifications, getAllNotifications} = useNotif()

  useEffect(() => {
    getAllNotifications()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [vesselId])

  let groupByDate = Object.values(
    notifications.reduce((acc: any, item) => {
      const date = item.createdAt.split('T')[0]
      if (!acc[date])
        acc[date] = {
          date: date,
          data: [],
        }
      acc[date].data.push(item)
      return acc
    }, {})
  )

  const sanitizedIcon = (icon: string) => {
    return icon.replace('fas fa-', '')
  }

  const sanitizedHTML = (labelHTML: string) => {
    let subject =
      labelHTML.match(/<a\/?[^>](.*?)<\/a>/g) == null
        ? ''
        : labelHTML.match(/<a\/?[^>](.*?)<\/a>/g).map(function (str) {
            return str.replace(/<\/?[^>]+(>|$)/g, '')
          })

    let notification = labelHTML.replace(/<\/?[^>]+(>|$)/g, '')
    notification = notification.replace(subject, ':::')
    notification = notification.split(':::')

    return (
      <Text>
        {notification[0] ? notification[0] : ''}
        <Text bold color="#29B7EF">
          {subject}
        </Text>
        {notification[1] ? notification[1] : ''}
      </Text>
    )
  }

  const Item = ({item}: any) => {
    const date = item.createdAt.split('T')[0]
    return (
      <HStack
        alignItems="center"
        backgroundColor="#fff"
        px={ms(16)}
        py={ms(10)}
        my={ms(8)}
        borderWidth={ms(1)}
        borderRadius={ms(5)}
        borderColor={!item.read ? '#BEE3F8' : '#E0E0E0'}
        bg="#fff"
        shadow={'1'}
      >
        {/* <Image
        alt="notif-img"
        source={Icons.completed}
        width={ms(32)}
        height={ms(32)}
        resizeMode="contain"
      /> */}
        <Icon
          name={sanitizedIcon(item.icon)}
          color="#23475C"
          size={24}
          style={{marginHorizontal: 5}}
        />
        <VStack pl="10px">
          <Text maxWidth={screenWidth - 100}>{sanitizedHTML(item.label)}</Text>
          <Text fontSize={ms(12)} color="#ADADAD">
            {moment(new Date()).isSame(moment(new Date(date)))
              ? `Today | ${moment(date).format('hh:mm A')}`
              : moment(date).format('MMM DD, YYYY hh:mm A')}
          </Text>
        </VStack>
        {!item.read && (
          <Box
            position={'absolute'}
            backgroundColor="#00A3FF"
            top="0"
            bottom="0"
            left="0"
            width="8px"
            borderTopLeftRadius={ms(5)}
            borderBottomLeftRadius={ms(5)}
          />
        )}
      </HStack>
    )
  }

  const HeaderSection = ({title}: any) => (
    <VStack backgroundColor="#fff">
      <Text fontSize={ms(15)} fontWeight="600" color="#23475C" my="10px">
        {moment(new Date()).isSame(moment(new Date(title)))
          ? `Today`
          : moment(title).format('MMM DD, YYYY')}
      </Text>
      <Divider mb={2} />
    </VStack>
  )

  const onPullToReload = () => {
    getAllNotifications()
  }

  const onReloadFleetNavLogs = (index: number, vessel: any) => {
    const selectedEntityVessel = entityUsers.find(
      e => e?.entity?.exploitationVessel?.id === vessel?.id
    )

    if (typeof selectedEntityVessel === 'object' && selectedEntityVessel?.id) {
      selectFleetVessel(index, selectedEntityVessel)
    } else {
      selectFleetVessel(index, vessel)
    }
  }

  if (isLoadingNotification) return <LoadingAnimated />

  return (
    <Box flex="1">
      {entityType === ENTITY_TYPE_EXPLOITATION_GROUP && (
        <FleetHeader
          onPress={(index: number, vessel: any) =>
            onReloadFleetNavLogs(index, vessel)
          }
        />
      )}
      <Box
        flex="1"
        backgroundColor={'#fff'}
        borderTopLeftRadius={ms(15)}
        borderTopRightRadius={ms(15)}
        p={ms(14)}
      >
        <SectionList
          refreshControl={
            <RefreshControl
              onRefresh={onPullToReload}
              refreshing={isLoadingNotification}
            />
          }
          sections={groupByDate}
          keyExtractor={(item, index) => item + index}
          renderItem={({item}) => <Item item={item} />}
          renderSectionHeader={({section: {date}}: any) => (
            <HeaderSection title={date} />
          )}
          stickySectionHeadersEnabled
          showsVerticalScrollIndicator={false}
        />
      </Box>
    </Box>
  )
}
