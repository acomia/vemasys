import React from 'react'
import {StyleSheet} from 'react-native'
import {Badge, Center, HStack, Image, Text} from 'native-base'
import {ms} from 'react-native-size-matters'

import {Animated, Icons} from '@bluecentury/assets'
import {Colors} from '@bluecentury/styles'
import {Charter} from '@bluecentury/models'

type Props = {
  charter: Charter
  isCreator: boolean
}

export const CharterStatus = ({charter, isCreator}: Props) => {
  const renderIcon = (status: string) => {
    const {isActive} = charter

    switch (status) {
      case 'planned':
        return Icons.planned
      case 'en_route':
        if (isActive) {
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
        if (isActive) {
          return Animated.nav_loading
        } else {
          return Icons.loading
        }
      case 'unloading':
        if (isActive) {
          return Animated.nav_unloading
        } else {
          return Icons.unloading
        }
      case 'loaded_en_route':
        if (isActive) {
          return Animated.loaded_enroute
        } else {
          return Icons.laoded_enroute
        }
      case 'refused':
        return Icons.refused
      default:
        return Icons.submitted
    }
  }

  const renderItem = () => {
    if (charter.status === 'new' && isCreator) {
      return null
    }
    if (charter.status === 'new') {
      return (
        <HStack alignItems="center" mr={ms(10)}>
          <Image
            alt="charter-status-icon"
            height={ms(30)}
            mr={ms(10)}
            resizeMode="contain"
            source={Icons.status_x_alt}
            width={ms(30)}
          />
          <Image
            alt="charter-status-icon"
            height={ms(30)}
            resizeMode="contain"
            source={Icons.status_check_alt}
            width={ms(30)}
          />
        </HStack>
      )
    } else {
      return (
        <Image
          alt="charter-status-icon"
          height={ms(30)}
          mb={ms(5)}
          resizeMode="contain"
          source={renderIcon(charter.status)}
          width={ms(30)}
        />
      )
    }
  }

  return (
    <Center opacity={charter.status === 'completed' ? 0.5 : 1}>
      {renderItem()}
      {charter.status === 'new' ? null : (
        <Badge style={[styles.badge, styles[`${charter.status}Status`]]}>
          <Text
            bold
            color={charter.status === 'draft' ? Colors.azure : Colors.white}
            fontSize={ms(12)}
          >
            {charter.status}
          </Text>
        </Badge>
      )}
    </Center>
  )
}

const styles = StyleSheet.create({
  draftStatus: {
    backgroundColor: Colors.border,
  },
  plannedStatus: {
    backgroundColor: Colors.border,
  },
  inboxStatus: {
    backgroundColor: Colors.border,
  },
  submittedStatus: {
    backgroundColor: Colors.border,
  },
  newStatus: {
    backgroundColor: Colors.highlighted_text,
  },
  en_routeStatus: {
    backgroundColor: Colors.azure,
  },
  loaded_en_routeStatus: {
    backgroundColor: Colors.azure,
  },
  loadingStatus: {
    backgroundColor: Colors.azure,
  },
  unloadingStatus: {
    backgroundColor: Colors.azure,
  },
  completedStatus: {
    backgroundColor: Colors.secondary,
  },
  acceptedStatus: {
    backgroundColor: Colors.highlighted_text,
  },
  refusedStatus: {
    backgroundColor: Colors.danger,
  },
  badge: {
    borderRadius: 5,
    justifyContent: 'center',
  },
})
