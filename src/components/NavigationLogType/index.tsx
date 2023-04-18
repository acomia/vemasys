import React from 'react'
import {Image} from 'native-base'
import {ms} from 'react-native-size-matters'
import _ from 'lodash'

import {Icons, Animated} from '@bluecentury/assets'
import {NavigationLog} from '@bluecentury/models'

interface INavlogType {
  navigationLog: NavigationLog
}
export const NavigationLogType = ({navigationLog}: INavlogType) => {
  const renderType = (navLog: NavigationLog) => {
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
    } = navLog

    const animatesIcon =
      (isActive || !_.isNull(startActionDatetime)) && _.isNull(endActionDate)
        ? true
        : false

    switch (location.type.title) {
      case 'Anchor':
        return (
          <Image
            alt="navlog-type-img"
            h={animatesIcon ? ms(48) : null}
            resizeMode="contain"
            source={animatesIcon ? Animated.waiting : Icons.waiting}
            w={animatesIcon ? ms(48) : null}
          />
        )
      case 'Berth':
        return (
          <Image
            alt="navlog-type-img"
            h={animatesIcon ? ms(48) : null}
            resizeMode="contain"
            source={animatesIcon ? Animated.waiting : Icons.waiting}
            w={animatesIcon ? ms(48) : null}
          />
        )
      case 'Bridge':
        return (
          <Image
            alt="navlog-type-img"
            h={animatesIcon ? ms(48) : null}
            resizeMode="contain"
            source={animatesIcon ? Animated.bridge : Icons.bridge}
            w={animatesIcon ? ms(48) : null}
          />
        )
      case 'Checkpoint':
        return (
          <Image
            alt="navlog-type-img"
            h={animatesIcon ? ms(48) : null}
            resizeMode="contain"
            source={animatesIcon ? Animated.checkpoint : Icons.checkpoint}
            w={animatesIcon ? ms(48) : null}
          />
        )
      case 'Junction':
        return (
          <Image
            alt="navlog-type-img"
            h={animatesIcon ? ms(48) : null}
            resizeMode="contain"
            source={animatesIcon ? Animated.junction : Icons.junction}
            w={animatesIcon ? ms(48) : null}
          />
        )
      case 'Sluice':
        return (
          <Image
            alt="navlog-type-img"
            h={animatesIcon ? ms(48) : null}
            resizeMode="contain"
            source={animatesIcon ? Animated.sluice : Icons.sluice}
            w={animatesIcon ? ms(48) : null}
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
              h={animatesIcon ? ms(48) : null}
              resizeMode="contain"
              source={animatesIcon ? Animated.waiting : Icons.waiting}
              w={animatesIcon ? ms(48) : null}
            />
          )
        } else if (actionType === 'Cleaning') {
          return (
            <Image
              alt="navlog-type-img"
              h={animatesIcon ? ms(60) : null}
              mb={animatesIcon ? -3 : 0}
              resizeMode="contain"
              source={animatesIcon ? Animated.cleaning : Icons.broom}
              w={animatesIcon ? ms(60) : null}
            />
          )
        } else if (bulkCargo.some(cargo => cargo.isLoading === false)) {
          return (
            <Image
              alt="navlog-type-img"
              h={animatesIcon ? ms(48) : null}
              mb={animatesIcon ? -3 : 0}
              resizeMode="contain"
              source={animatesIcon ? Animated.nav_unloading : Icons.unloading}
              w={animatesIcon ? ms(48) : null}
            />
          )
        } else {
          return (
            <Image
              alt="navlog-type-img"
              h={animatesIcon ? ms(48) : null}
              mb={animatesIcon ? -3 : 0}
              resizeMode="contain"
              source={animatesIcon ? Animated.nav_loading : Icons.loading}
              w={animatesIcon ? ms(48) : null}
            />
          )
        }
    }
  }

  return <>{renderType(navigationLog)}</>
}

export default NavigationLogType
