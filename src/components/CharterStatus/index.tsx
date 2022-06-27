import React from 'react'
import {StyleSheet} from 'react-native'
import {Badge, Center, Image, Text} from 'native-base'
import {ms} from 'react-native-size-matters'

import {
  CHARTER_ORDERER_STATUS_COMPLETED,
  CHARTER_CONTRACTOR_STATUS_ARCHIVED,
  ENTITY_TYPE_EXPLOITATION_VESSEL,
  ENTITY_TYPE_EXPLOITATION_GROUP
} from '@bluecentury/constants'
import {Animated, Icons} from '@bluecentury/assets'
import {Colors} from '@bluecentury/styles'

export const CharterStatus = ({entityType, charter}: any) => {
  const getStatus = (
    charter: {ordererStatus: string; contractorStatus: string},
    selectedEntityType: string
  ) => {
    if (
      charter.ordererStatus === CHARTER_ORDERER_STATUS_COMPLETED &&
      charter.contractorStatus !== CHARTER_CONTRACTOR_STATUS_ARCHIVED
    ) {
      return CHARTER_ORDERER_STATUS_COMPLETED
    }

    if (charter.contractorStatus === CHARTER_CONTRACTOR_STATUS_ARCHIVED)
      return charter.contractorStatus

    return selectedEntityType === ENTITY_TYPE_EXPLOITATION_VESSEL ||
      selectedEntityType === ENTITY_TYPE_EXPLOITATION_GROUP
      ? charter.contractorStatus
      : charter.ordererStatus
  }

  const renderIcon = (status: string) => {
    const {isCurrentlyActive} = charter

    switch (status) {
      case 'planned':
        return Icons.planned
      case 'en_route':
        if (isCurrentlyActive) {
          return Animated.nav_navigating
        } else {
          return Icons.en_route
        }
      case 'completed':
        return Icons.completed
      case 'inbox':
        return Icons.inbox
      case 'draft':
        return Icons.draft
      case 'accepted':
        return Icons.accepted
      case 'loading':
        if (isCurrentlyActive) {
          return Animated.nav_loading
        } else {
          return Icons.loading
        }
      case 'unloading':
        if (isCurrentlyActive) {
          return Animated.nav_unloading
        } else {
          return Icons.unloading
        }
      case 'loaded_en_route':
        if (isCurrentlyActive) {
          return Animated.loaded_enroute
        } else {
          return Icons.laoded_enroute
        }
      default:
        return Icons.submitted
    }
  }

  const status = getStatus(charter, entityType)
  return (
    <Center>
      <Image
        alt="charter-status-icon"
        source={renderIcon(status)}
        width={ms(30)}
        height={ms(30)}
        mb={ms(5)}
        resizeMode="contain"
      />
      <Badge style={[styles.badge, styles[`${status}Status`]]}>
        <Text
          fontWeight="bold"
          fontSize={ms(12)}
          color={status === 'draft' ? Colors.azure : Colors.white}
        >
          {status}
        </Text>
      </Badge>
    </Center>
  )
}

const styles = StyleSheet.create({
  draftStatus: {
    backgroundColor: '#BEE3F8'
  },
  plannedStatus: {
    backgroundColor: '#BEE3F8'
  },
  inboxStatus: {
    backgroundColor: '#BEE3F8'
  },
  submittedStatus: {
    backgroundColor: '#BEE3F8'
  },
  newStatus: {
    backgroundColor: '#29B7EF'
  },
  en_routeStatus: {
    backgroundColor: '#23475C'
  },
  loaded_en_routeStatus: {
    backgroundColor: '#23475C'
  },
  loadingStatus: {
    backgroundColor: '#23475C'
  },
  unloadingStatus: {
    backgroundColor: '#23475C'
  },
  completedStatus: {
    backgroundColor: '#6BBF87'
  },
  acceptedStatus: {
    backgroundColor: '#29B7EF'
  },
  badge: {
    borderRadius: 5,
    width: 102,
    justifyContent: 'center'
  }
})
