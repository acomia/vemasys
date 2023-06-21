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
  isSmall?: boolean
}
export const NavigationLogType = ({
  navigationLog,
  isFinished,
  isLotty,
  isSmall,
}: INavlogType) => {
  if (!navigationLog?.location) return null
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
            speed={0.09}
          />
        ) : (
          <Image
            alt="navlog-type-img"
            h={animatesIcon ? ms(48) : isSmall ? ms(35) : null}
            resizeMode="contain"
            source={animatesIcon ? Animated.waiting : Icons.waiting}
            w={animatesIcon ? ms(48) : isSmall ? ms(35) : null}
          />
        )
      case 'Berth':
        return isLotty && animatesIcon ? (
          <Lottie
            // ref={animationRef}
            loop
            autoPlay={true}
            source={require('@bluecentury/assets/animated/lottie/waiting.json')}
            speed={0.09}
          />
        ) : (
          <Image
            alt="navlog-type-img"
            h={animatesIcon ? ms(48) : isSmall ? ms(35) : null}
            resizeMode="contain"
            source={animatesIcon ? Animated.waiting : Icons.waiting}
            w={animatesIcon ? ms(48) : isSmall ? ms(35) : null}
          />
        )
      case 'Bridge':
        return isLotty && animatesIcon ? (
          <Lottie
            // ref={animationRef}
            loop
            autoPlay={true}
            source={require('@bluecentury/assets/animated/lottie/bridge.json')}
            speed={0.09}
          />
        ) : (
          <Image
            alt="navlog-type-img"
            h={animatesIcon ? ms(48) : isSmall ? ms(35) : null}
            resizeMode="contain"
            source={animatesIcon ? Animated.bridge : Icons.bridge}
            w={animatesIcon ? ms(48) : isSmall ? ms(35) : null}
          />
        )
      case 'Checkpoint':
        return isLotty && animatesIcon ? (
          <Lottie
            // ref={animationRef}
            loop
            autoPlay={true}
            source={require('@bluecentury/assets/animated/lottie/checkpoint.json')}
            speed={0.09}
          />
        ) : (
          <Image
            alt="navlog-type-img"
            h={animatesIcon ? ms(48) : isSmall ? ms(35) : null}
            resizeMode="contain"
            source={animatesIcon ? Animated.checkpoint : Icons.checkpoint}
            w={animatesIcon ? ms(48) : isSmall ? ms(35) : null}
          />
        )
      case 'Junction':
        return isLotty && animatesIcon ? (
          <Lottie
            // ref={animationRef}
            loop
            autoPlay={true}
            source={require('@bluecentury/assets/animated/lottie/junction.json')}
            speed={0.09}
          />
        ) : (
          <Image
            alt="navlog-type-img"
            h={animatesIcon ? ms(48) : isSmall ? ms(35) : null}
            resizeMode="contain"
            source={animatesIcon ? Animated.junction : Icons.junction}
            w={animatesIcon ? ms(48) : isSmall ? ms(35) : null}
          />
        )
      case 'Sluice':
        return isLotty && animatesIcon ? (
          <Lottie
            // ref={animationRef}
            loop
            autoPlay={true}
            source={require('@bluecentury/assets/animated/lottie/sluice.json')}
            speed={0.09}
          />
        ) : (
          <Image
            alt="navlog-type-img"
            h={animatesIcon ? ms(48) : isSmall ? ms(35) : null}
            resizeMode="contain"
            source={animatesIcon ? Animated.sluice : Icons.sluice}
            w={animatesIcon ? ms(48) : isSmall ? ms(35) : null}
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
              speed={0.09}
            />
          ) : (
            <Image
              alt="navlog-type-img"
              h={animatesIcon ? ms(48) : isSmall ? ms(35) : null}
              resizeMode="contain"
              source={animatesIcon ? Animated.waiting : Icons.waiting}
              w={animatesIcon ? ms(48) : isSmall ? ms(35) : null}
            />
          )
        } else if (actionType === 'Cleaning') {
          return isLotty && animatesIcon ? (
            <Lottie
              // ref={animationRef}
              loop
              autoPlay={true}
              source={require('@bluecentury/assets/animated/lottie/cleaning.json')}
              speed={0.09}
            />
          ) : (
            <Image
              alt="navlog-type-img"
              h={animatesIcon ? ms(60) : isSmall ? ms(35) : null}
              mb={animatesIcon ? -3 : 0}
              resizeMode="contain"
              source={animatesIcon ? Animated.cleaning : Icons.broom}
              w={animatesIcon ? ms(60) : isSmall ? ms(35) : null}
            />
          )
        } else if (bulkCargo.some(cargo => cargo.isLoading === false)) {
          return isLotty && animatesIcon ? (
            <Lottie
              // ref={animationRef}
              loop
              autoPlay={true}
              source={require('@bluecentury/assets/animated/lottie/unloading.json')}
              speed={0.09}
            />
          ) : (
            <Image
              alt="navlog-type-img"
              h={animatesIcon ? ms(48) : isSmall ? ms(35) : null}
              mb={animatesIcon ? -3 : 0}
              resizeMode="contain"
              source={animatesIcon ? Animated.nav_unloading : Icons.unloading}
              w={animatesIcon ? ms(48) : isSmall ? ms(35) : null}
            />
          )
        } else {
          return isLotty && animatesIcon ? (
            <Lottie
              // ref={animationRef}
              loop
              autoPlay={true}
              source={require('@bluecentury/assets/animated/lottie/nav_loading.json')}
              speed={0.09}
            />
          ) : (
            <Image
              alt="navlog-type-img"
              h={animatesIcon ? ms(48) : isSmall ? ms(35) : null}
              mb={animatesIcon ? -3 : 0}
              resizeMode="contain"
              source={animatesIcon ? Animated.nav_loading : Icons.loading}
              w={animatesIcon ? ms(48) : isSmall ? ms(35) : null}
            />
          )
        }
    }
  }

  return <>{renderType(navigationLog)}</>
}

export default NavigationLogType
