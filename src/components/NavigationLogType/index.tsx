import React from 'react'
import {Image} from 'native-base'
import {Icons, Animated} from '@bluecentury/assets'
import {ms} from 'react-native-size-matters'

export const NavigationLogType = ({navigationLog}: any) => {
  const renderType = (navigationLog: any) => {
    const {
      location,
      isActive,
      arrivalDatetime,
      departureDatetime,
      startActionDatetime,
      endActionDatetime,
      bulkCargo
    } = navigationLog

    switch (location.type.title) {
      case 'Anchor':
        return (
          <Image
            alt="navlog-type-img"
            source={isActive ? Animated.waiting : Icons.waiting}
            resizeMode="contain"
            w={isActive ? ms(50) : null}
            h={isActive ? ms(50) : null}
          />
        )
      case 'Berth':
        return (
          <Image
            alt="navlog-type-img"
            source={isActive ? Animated.waiting : Icons.waiting}
            resizeMode="contain"
            w={isActive ? ms(50) : null}
            h={isActive ? ms(50) : null}
          />
        )
      case 'Bridge':
        return (
          <Image
            alt="navlog-type-img"
            source={isActive ? Animated.bridge : Icons.bridge}
            resizeMode="contain"
            w={isActive ? ms(50) : null}
            h={isActive ? ms(50) : null}
          />
        )
      case 'Checkpoint':
        return (
          <Image
            alt="navlog-type-img"
            source={isActive ? Animated.checkpoint : Icons.checkpoint}
            resizeMode="contain"
            w={isActive ? ms(50) : null}
            h={isActive ? ms(50) : null}
          />
        )
      case 'Junction':
        return (
          <Image
            alt="navlog-type-img"
            source={isActive ? Animated.junction : Icons.junction}
            resizeMode="contain"
            w={isActive ? ms(50) : null}
            h={isActive ? ms(50) : null}
          />
        )
      case 'Sluice':
        return (
          <Image
            alt="navlog-type-img"
            source={isActive ? Animated.sluice : Icons.sluice}
            resizeMode="contain"
            w={isActive ? ms(50) : null}
            h={isActive ? ms(50) : null}
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
              source={isActive ? Animated.waiting : Icons.waiting}
              resizeMode="contain"
              w={isActive ? ms(50) : null}
              h={isActive ? ms(50) : null}
            />
          )
        } else if (bulkCargo.some(cargo => cargo.isLoading === false)) {
          return (
            <Image
              alt="navlog-type-img"
              source={isActive ? Animated.nav_unloading : Icons.unloading}
              resizeMode="contain"
              w={isActive ? ms(50) : null}
              h={isActive ? ms(50) : null}
            />
          )
        } else {
          return (
            <Image
              alt="navlog-type-img"
              source={isActive ? Animated.nav_loading : Icons.loading}
              resizeMode="contain"
              w={isActive ? ms(50) : null}
              h={isActive ? ms(50) : null}
            />
          )
        }
    }
  }

  return <>{renderType(navigationLog)}</>
}

export default NavigationLogType
