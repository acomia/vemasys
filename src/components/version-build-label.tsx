import React, {useCallback, useEffect, useState} from 'react'
import {Link} from 'native-base'
import _ from 'lodash'
import DeviceInfo from 'react-native-device-info'
import {useSettings} from '@bluecentury/stores'
import {
  CommonActions,
  useFocusEffect,
  useNavigation,
} from '@react-navigation/native'
import {Platform} from 'react-native'

interface Props {
  hideVersionName?: boolean
}

export function VersionBuildLabel({hideVersionName = false}: Props) {
  const navigation = useNavigation()
  const {env} = useSettings()
  const [count, setCount] = useState(0)
  const version =
    Platform.OS === 'ios'
      ? DeviceInfo.getReadableVersion()
      : DeviceInfo.getVersion()

  // resets the count back to 0 when screen is focused
  useFocusEffect(
    useCallback(() => {
      setCount(0)
    }, [])
  )
  // monitors count, if it reaches 10 it will navigate to
  // select environment screen
  useEffect(() => {
    if (count === 10) {
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{name: 'SelectEnvironment'}],
        })
      )
    }
  })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const incrementCount = useCallback(
    // use throttling function
    _.throttle(_count => setCount(_count), 500),
    []
  )
  const handleOnPressChangeEnvironment = () => {
    incrementCount(count + 1)
  }
  return (
    <Link isUnderlined={false} onPress={handleOnPressChangeEnvironment}>
      Vemasys &copy; 2022 {env === 'UAT' ? env : ''}{' '}
      {!hideVersionName && `v${version}`}
    </Link>
  )
}
