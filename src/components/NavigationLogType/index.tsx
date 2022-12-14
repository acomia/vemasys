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
            w={animatesIcon ? ms(50) : null}
            h={animatesIcon ? ms(50) : null}
          />
        )
      case 'Berth':
        return (
          <Image
            alt="navlog-type-img"
            source={animatesIcon ? Animated.waiting : Icons.waiting}
            resizeMode="contain"
            w={animatesIcon ? ms(50) : null}
            h={animatesIcon ? ms(50) : null}
          />
        )
      case 'Bridge':
        return (
          <Image
            alt="navlog-type-img"
            source={animatesIcon ? Animated.bridge : Icons.bridge}
            resizeMode="contain"
            w={animatesIcon ? ms(50) : null}
            h={animatesIcon ? ms(50) : null}
          />
        )
      case 'Checkpoint':
        return (
          <Image
            alt="navlog-type-img"
            source={animatesIcon ? Animated.checkpoint : Icons.checkpoint}
            resizeMode="contain"
            w={animatesIcon ? ms(50) : null}
            h={animatesIcon ? ms(50) : null}
          />
        )
      case 'Junction':
        return (
          <Image
            alt="navlog-type-img"
            source={animatesIcon ? Animated.junction : Icons.junction}
            resizeMode="contain"
            w={animatesIcon ? ms(50) : null}
            h={animatesIcon ? ms(50) : null}
          />
        )
      case 'Sluice':
        return (
          <Image
            alt="navlog-type-img"
            source={animatesIcon ? Animated.sluice : Icons.sluice}
            resizeMode="contain"
            w={animatesIcon ? ms(50) : null}
            h={animatesIcon ? ms(50) : null}
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
              w={animatesIcon ? ms(50) : null}
              h={animatesIcon ? ms(50) : null}
            />
          )
        } else if (bulkCargo.some(cargo => cargo.isLoading === false)) {
          return (
            <Image
              alt="navlog-type-img"
              source={animatesIcon ? Animated.nav_unloading : Icons.unloading}
              resizeMode="contain"
              w={animatesIcon ? ms(50) : null}
              h={animatesIcon ? ms(50) : null}
            />
          )
        } else {
          return (
            <Image
              alt="navlog-type-img"
              source={animatesIcon ? Animated.nav_loading : Icons.loading}
              resizeMode="contain"
              w={animatesIcon ? ms(50) : null}
              h={animatesIcon ? ms(50) : null}
            />
          )
        }
    }
  }

  return <>{renderType(navigationLog)}</>
}

export default NavigationLogType
