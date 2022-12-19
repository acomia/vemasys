import React from 'react'
import {Image} from 'native-base'
import {Icons, Animated} from '@bluecentury/assets'
import {ms} from 'react-native-size-matters'
import _ from 'lodash'

export const NavigationLogType = ({navigationLog}: any) => {
  const renderType = (navigationLog: any) => {
    const {
      location,
      isActive,
      arrivalDatetime,
      departureDatetime,
      startActionDatetime,
      endActionDatetime,
      bulkCargo,
      endActionDate,
      actionType,
    } = navigationLog

    const animatesIcon =
      (isActive || !_.isNull(startActionDatetime)) && _.isNull(endActionDate)
        ? true
        : false

    switch (location.type.title) {
      case 'Anchor':
        return (
          <Image
            alt="navlog-type-img"
            source={animatesIcon ? Animated.waiting : Icons.waiting}
            resizeMode="contain"
            w={animatesIcon ? ms(48) : null}
            h={animatesIcon ? ms(48) : null}
          />
        )
      case 'Berth':
        return (
          <Image
            alt="navlog-type-img"
            source={animatesIcon ? Animated.waiting : Icons.waiting}
            resizeMode="contain"
            w={animatesIcon ? ms(48) : null}
            h={animatesIcon ? ms(48) : null}
          />
        )
      case 'Bridge':
        return (
          <Image
            alt="navlog-type-img"
            source={animatesIcon ? Animated.bridge : Icons.bridge}
            resizeMode="contain"
            w={animatesIcon ? ms(48) : null}
            h={animatesIcon ? ms(48) : null}
          />
        )
      case 'Checkpoint':
        return (
          <Image
            alt="navlog-type-img"
            source={animatesIcon ? Animated.checkpoint : Icons.checkpoint}
            resizeMode="contain"
            w={animatesIcon ? ms(48) : null}
            h={animatesIcon ? ms(48) : null}
          />
        )
      case 'Junction':
        return (
          <Image
            alt="navlog-type-img"
            source={animatesIcon ? Animated.junction : Icons.junction}
            resizeMode="contain"
            w={animatesIcon ? ms(48) : null}
            h={animatesIcon ? ms(48) : null}
          />
        )
      case 'Sluice':
        return (
          <Image
            alt="navlog-type-img"
            source={animatesIcon ? Animated.sluice : Icons.sluice}
            resizeMode="contain"
            w={animatesIcon ? ms(48) : null}
            h={animatesIcon ? ms(48) : null}
          />
        )
      case 'Terminal':
        if (
          arrivalDatetime &&
          !departureDatetime &&
          !startActionDatetime &&
          !endActionDatetime
        ) {
          return (
            <Image
              alt="navlog-type-img"
              source={animatesIcon ? Animated.waiting : Icons.waiting}
              resizeMode="contain"
              w={animatesIcon ? ms(48) : null}
              h={animatesIcon ? ms(48) : null}
            />
          )
        } else if (actionType === 'Cleaning') {
          return (
            <Image
              alt="navlog-type-img"
              source={animatesIcon ? Animated.cleaning : Icons.broom}
              resizeMode="contain"
              w={animatesIcon ? ms(48) : null}
              h={animatesIcon ? ms(48) : null}
              mb={animatesIcon ? -3 : 0}
            />
          )
        } else if (bulkCargo.some(cargo => cargo.isLoading === false)) {
          return (
            <Image
              alt="navlog-type-img"
              source={animatesIcon ? Animated.nav_unloading : Icons.unloading}
              resizeMode="contain"
              w={animatesIcon ? ms(48) : null}
              h={animatesIcon ? ms(48) : null}
              mb={animatesIcon ? -3 : 0}
            />
          )
        } else {
          return (
            <Image
              alt="navlog-type-img"
              source={animatesIcon ? Animated.nav_loading : Icons.loading}
              resizeMode="contain"
              w={animatesIcon ? ms(48) : null}
              h={animatesIcon ? ms(48) : null}
              mb={animatesIcon ? -3 : 0}
            />
          )
        }
    }
  }

  return <>{renderType(navigationLog)}</>
}

export default NavigationLogType
