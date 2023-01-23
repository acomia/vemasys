import React, {useEffect} from 'react'
import {SectionList, RefreshControl} from 'react-native'
import {Box, Divider, Text, VStack} from 'native-base'
import {ms} from 'react-native-size-matters'
import moment from 'moment'
import {useNotif, useEntity} from '@bluecentury/stores'
import {
  FleetHeader,
  LoadingAnimated,
  NotificationItem,
} from '@bluecentury/components'
import {ENTITY_TYPE_EXPLOITATION_GROUP} from '@bluecentury/constants'
import {useTranslation} from 'react-i18next'

export default function Notification() {
  const {t} = useTranslation()
  const {entityType, entityUsers, selectFleetVessel, vesselId} = useEntity()
  const {isLoadingNotification, notifications, getAllNotifications} = useNotif()

  useEffect(() => {
    getAllNotifications()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [vesselId])

  const groupByDate = Object.values(
    notifications.reduce((acc: any, item) => {
      const date = item.createdAt.split('T')[0]
      if (!acc[date]) {
        acc[date] = {
          date: date,
          data: [],
        }
      }
      acc[date].data.push(item)
      return acc
    }, {})
  )

  const HeaderSection = ({title}: any) => (
    <VStack backgroundColor="#fff">
      <Text color="#23475C" fontSize={ms(15)} fontWeight="600" my="10px">
        {moment(new Date()).isSame(moment(new Date(title)))
          ? t('today')
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
        backgroundColor={'#fff'}
        borderTopLeftRadius={ms(15)}
        borderTopRightRadius={ms(15)}
        flex="1"
        p={ms(14)}
      >
        <SectionList
          stickySectionHeadersEnabled
          refreshControl={
            <RefreshControl
              refreshing={isLoadingNotification}
              onRefresh={onPullToReload}
            />
          }
          renderSectionHeader={({section: {date}}: any) => (
            <HeaderSection title={date} />
          )}
          keyExtractor={(item, index) => item + index}
          renderItem={({item}) => <NotificationItem item={item} />}
          sections={groupByDate}
          showsVerticalScrollIndicator={false}
        />
      </Box>
    </Box>
  )
}
