import React, {useEffect, useState} from 'react'
import {TouchableOpacity} from 'react-native'
import {Box, Button, FlatList, HStack, Modal, Spacer, Text} from 'native-base'
import {NativeStackScreenProps} from '@react-navigation/native-stack'
import {SafeAreaView} from 'react-native-safe-area-context'
import Icon from 'react-native-vector-icons/FontAwesome5'
import {ms} from 'react-native-size-matters'

import {Colors} from '@bluecentury/styles'
import {IconButton, NoInternetConnectionMessage} from '@bluecentury/components'
import {Icons} from '@bluecentury/assets'
import {useEntity, useMap, useSettings} from '@bluecentury/stores'
import {useTranslation} from 'react-i18next'

type Props = NativeStackScreenProps<RootStackParamList>

export default function Formations({navigation}: Props) {
  const {t} = useTranslation()
  const {
    activeFormations,
    getActiveFormations,
    endVesselFormations,
    removeVesselFromFormations,
  } = useMap()
  const {vesselId} = useEntity()
  const {isQrScanner} = useSettings()
  const [dropOffModal, setDropOffModal] = useState(false)
  const [selectedBarge, setSelectedBarge] = useState<any>(null)

  const bargeName =
    selectedBarge?.entity?.alias !== null
      ? selectedBarge?.entity?.alias
      : selectedBarge?.entity?.name

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => {
        if (!isQrScanner) return null

        return (
          <IconButton source={Icons.qr} onPress={() => navigation.goBack()} />
        )
      },
    })
    getActiveFormations()
  }, [])

  const renderItem = ({item, index}: any) => {
    const name =
      item?.entity?.alias !== null ? item?.entity?.alias : item?.entity?.name
    return (
      <HStack
        key={index}
        borderRadius={ms(5)}
        justifyContent="space-between"
        alignItems="center"
        height={ms(60)}
        px={ms(20)}
        width="full"
        mt={ms(10)}
        borderWidth={ms(1)}
        borderColor="#BEE3F8"
        bg="#fff"
        shadow={1}
      >
        <Text bold color="#23272F">
          {name}
        </Text>
        <TouchableOpacity onPress={() => onUnlinkPress(item)}>
          <Icon name="unlink" size={20} color={Colors.azure} />
        </TouchableOpacity>
      </HStack>
    )
  }

  const onUnlinkPress = (barge: any) => {
    setDropOffModal(true)
    setSelectedBarge(barge)
  }

  const onDropOffPress = () => {
    try {
      if (activeFormations[0].exploitationVessels.length === 1) {
        // End Formations
        endVesselFormations(activeFormations[0].id, selectedBarge?.id)
        setTimeout(() => {
          setSelectedBarge(null)
          setDropOffModal(false)
          getActiveFormations()
        }, 1000)
      } else {
        // Remove Vessel from the Formations
        removeVesselFromFormations(activeFormations[0].id, selectedBarge?.id)
        setTimeout(() => {
          setSelectedBarge(null)
          setDropOffModal(false)
          getActiveFormations()
        }, 1000)
      }
    } catch (error) {}
  }

  return (
    <SafeAreaView style={{flex: 1}}>
      <NoInternetConnectionMessage />
      <FlatList
        data={
          activeFormations.length > 0
            ? activeFormations[0].exploitationVessels.filter(
                vessel => vessel.id !== vesselId
              )
            : []
        }
        renderItem={renderItem}
        keyExtractor={item => `Formations-${item.id}`}
        contentContainerStyle={{
          flexGrow: 1,
          padding: 20,
          paddingBottom: 30,
          backgroundColor: '#fff',
          borderTopLeftRadius: 15,
          borderTopRightRadius: 15,
        }}
        ListEmptyComponent={() => (
          <Text
            fontSize={ms(16)}
            bold
            textAlign="center"
            color={Colors.azure}
            mt={ms(20)}
          >
            {t('noActiveFormations')}
          </Text>
        )}
      />
      <Modal isOpen={dropOffModal} animationPreset="slide">
        <Modal.Content width="95%" px={ms(10)}>
          <Modal.Header>Drop off</Modal.Header>
          <Modal.Body py={ms(20)}>
            <Text>
              {t('wouldYouLikeToDropOff')}
              <Text fontWeight="medium" color={Colors.primary}>
                {bargeName}
              </Text>
            </Text>
          </Modal.Body>
          <Modal.Footer
            justifyContent="space-between"
            flexDirection="row"
            px={ms(0)}
          >
            <Button
              flex="1"
              backgroundColor={Colors.light}
              mr={ms(5)}
              onPress={() => setDropOffModal(false)}
            >
              {t('cancel')}
            </Button>
            <Button
              flex="1"
              backgroundColor={Colors.primary}
              ml={ms(5)}
              onPress={onDropOffPress}
            >
              {t('dropOff')}
            </Button>
          </Modal.Footer>
        </Modal.Content>
      </Modal>
    </SafeAreaView>
  )
}
