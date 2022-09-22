import React, {useCallback, useEffect, useState} from 'react'
import {Link} from 'native-base'
import DeviceInfo from 'react-native-device-info'
import {useSettings} from '@bluecentury/stores'
import {
  CommonActions,
  useFocusEffect,
  useNavigation
} from '@react-navigation/native'
import _ from 'lodash'

export function VersionBuildLabel() {
  const navigation = useNavigation()
  const readableVersion = DeviceInfo.getReadableVersion()
  const {env} = useSettings()
  const [count, setCount] = useState(0)

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
          routes: [{name: 'SelectEnvironment'}]
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
      Vemasys v{readableVersion} &copy; 2022 {env === 'UAT' ? env : ''}
    </Link>
  )
}
