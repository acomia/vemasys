import React, {useRef} from 'react'
import {Image} from 'native-base'
import {ms} from 'react-native-size-matters'
import _ from 'lodash'

import {Icons, Animated} from '@bluecentury/assets'
import {NavigationLog} from '@bluecentury/models'
import Lottie from 'lottie-react-native'

interface INavlogType {
  navigationLog: NavigationLog
  isFinished?: boolean
  isLotty?: boolean
}
export const NavigationLogType = ({
  navigationLog,
  isFinished,
  isLotty,
}: INavlogType) => {
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
    const animatesIcon = isActive || _.isNull(endActionDate)

    switch (location.type.title) {
      case 'Anchor':
        return isLotty && animatesIcon ? (
          <Lottie
            // ref={animationRef}
            loop
            autoPlay={true}
            source={require('@bluecentury/assets/animated/lottie/waiting.json')}
          />
        ) : (
          <Image
            alt="navlog-type-img"
            h={animatesIcon ? ms(48) : null}
            resizeMode="contain"
            source={animatesIcon ? Animated.waiting : Icons.waiting}
            w={animatesIcon ? ms(48) : null}
          />
        )
      case 'Berth':
        return isLotty && animatesIcon ? (
          <Lottie
            // ref={animationRef}
            loop
            autoPlay={true}
            source={require('@bluecentury/assets/animated/lottie/waiting.json')}
          />
        ) : (
          <Image
            alt="navlog-type-img"
            h={animatesIcon ? ms(48) : null}
            resizeMode="contain"
            source={animatesIcon ? Animated.waiting : Icons.waiting}
            w={animatesIcon ? ms(48) : null}
          />
        )
      case 'Bridge':
        return isLotty && animatesIcon ? (
          <Lottie
            // ref={animationRef}
            loop
            autoPlay={true}
            source={require('@bluecentury/assets/animated/lottie/bridge.json')}
          />
        ) : (
          <Image
            alt="navlog-type-img"
            h={animatesIcon ? ms(48) : null}
            resizeMode="contain"
            source={animatesIcon ? Animated.bridge : Icons.bridge}
            w={animatesIcon ? ms(48) : null}
          />
        )
      case 'Checkpoint':
        return isLotty && animatesIcon ? (
          <Lottie
            // ref={animationRef}
            loop
            autoPlay={true}
            source={require('@bluecentury/assets/animated/lottie/checkpoint.json')}
          />
        ) : (
          <Image
            alt="navlog-type-img"
            h={animatesIcon ? ms(48) : null}
            resizeMode="contain"
            source={animatesIcon ? Animated.checkpoint : Icons.checkpoint}
            w={animatesIcon ? ms(48) : null}
          />
        )
      case 'Junction':
        return isLotty && animatesIcon ? (
          <Lottie
            // ref={animationRef}
            loop
            autoPlay={true}
            source={require('@bluecentury/assets/animated/lottie/junction.json')}
          />
        ) : (
          <Image
            alt="navlog-type-img"
            h={animatesIcon ? ms(48) : null}
            resizeMode="contain"
            source={animatesIcon ? Animated.junction : Icons.junction}
            w={animatesIcon ? ms(48) : null}
          />
        )
      case 'Sluice':
        return isLotty && animatesIcon ? (
          <Lottie
            // ref={animationRef}
            loop
            autoPlay={true}
            source={require('@bluecentury/assets/animated/lottie/sluice.json')}
          />
        ) : (
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
          return isLotty && animatesIcon ? (
            <Lottie
              // ref={animationRef}
              loop
              autoPlay={true}
              source={require('@bluecentury/assets/animated/lottie/waiting.json')}
            />
          ) : (
            <Image
              alt="navlog-type-img"
              h={animatesIcon ? ms(48) : null}
              resizeMode="contain"
              source={animatesIcon ? Animated.waiting : Icons.waiting}
              w={animatesIcon ? ms(48) : null}
            />
          )
        } else if (actionType === 'Cleaning') {
          return isLotty && animatesIcon ? (
            <Lottie
              // ref={animationRef}
              loop
              autoPlay={true}
              source={require('@bluecentury/assets/animated/lottie/cleaning.json')}
            />
          ) : (
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
          return isLotty && animatesIcon ? (
            <Lottie
              // ref={animationRef}
              loop
              autoPlay={true}
              source={require('@bluecentury/assets/animated/lottie/unloading.json')}
            />
          ) : (
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
          return isLotty && animatesIcon ? (
            <Lottie
              // ref={animationRef}
              loop
              autoPlay={true}
              source={require('@bluecentury/assets/animated/lottie/nav_loading.json')}
            />
          ) : (
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
