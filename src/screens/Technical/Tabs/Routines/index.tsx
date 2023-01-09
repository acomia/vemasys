import React, {useEffect, useState} from 'react'
import {Dimensions, RefreshControl, TouchableOpacity} from 'react-native'
import {Box, HStack, Icon, Image, ScrollView, Text} from 'native-base'
import {ms} from 'react-native-size-matters'
import {useNavigation} from '@react-navigation/native'

import {Colors} from '@bluecentury/styles'
import {useEntity, useTechnical} from '@bluecentury/stores'
import {LoadingAnimated} from '@bluecentury/components'
import {Icons} from '@bluecentury/assets'
import {useTranslation} from 'react-i18next'

const {width} = Dimensions.get('window')
const Routines = () => {
  const {t} = useTranslation()
  const navigation = useNavigation()
  const {isTechnicalLoading, routinesCategory, getVesselRoutines} =
    useTechnical()
  const {vesselId} = useEntity()
  const [pullRefresh, setPullRefresh] = useState(false)

  useEffect(() => {
    getVesselRoutines(vesselId)
  }, [vesselId])

  const onPullRefresh = () => {
    setPullRefresh(true)
    getVesselRoutines(vesselId)
    setPullRefresh(false)
  }

  // if (isTechnicalLoading) return <LoadingAnimated />

  return (
    <Box flex="1">
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          paddingBottom: 30,
        }}
        scrollEventThrottle={16}
        refreshControl={
          <RefreshControl onRefresh={onPullRefresh} refreshing={pullRefresh} />
        }
        showsVerticalScrollIndicator={false}
        px={ms(12)}
        py={ms(20)}
        bg={Colors.white}
      >
        <Text fontSize={ms(20)} bold color={Colors.azure}>
          {t('overview')}
        </Text>
        <HStack
          flexWrap="wrap"
          justifyContent="space-between"
          alignItems="center"
          mt={ms(15)}
        >
          {routinesCategory?.length > 0 ? (
            routinesCategory?.map((task: any, index) => {
              let icon = undefined
              switch (task.key) {
                case 'clipboard':
                  icon = Icons.clipboard
                  break
                case 'archived':
                  icon = Icons.status_archived
                  break
                case 'in_order':
                  icon = Icons.status_check_alt
                  break
                case 'due':
                  icon = Icons.status_exclamation_alt
                  break
                case 'overdue':
                  icon = Icons.status_x_alt
                  break
                default:
                  icon = Icons.clipboard
                  break
              }
              return (
                <TouchableOpacity
                  key={index}
                  activeOpacity={0.6}
                  onPress={() =>
                    navigation.navigate('TechnicalRoutinesList', {
                      category: task.key,
                      title: task.label,
                    })
                  }
                >
                  <Box
                    w={width / 2 - 30}
                    p={ms(30)}
                    alignItems="center"
                    justifyContent="center"
                    bg={Colors.white}
                    borderRadius={ms(5)}
                    shadow={4}
                    mt={ms(10)}
                  >
                    <Image alt={`${task.key}-icon`} source={icon} mb={ms(15)} />
                    <Text fontSize={ms(22)} bold color={Colors.text}>
                      {task.count}
                    </Text>
                    <Text fontWeight="medium" color={Colors.text}>
                      {t(task.label)}
                    </Text>
                  </Box>
                </TouchableOpacity>
              )
            })
          ) : (
            <LoadingAnimated />
          )}
        </HStack>
      </ScrollView>
    </Box>
  )
}

export default Routines
