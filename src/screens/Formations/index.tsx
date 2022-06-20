import React, {useEffect, useState} from 'react'
import {TouchableOpacity} from 'react-native'
import {Box, Button, FlatList, HStack, Modal, Spacer, Text} from 'native-base'
import {NativeStackScreenProps} from '@react-navigation/native-stack'
import {SafeAreaView} from 'react-native-safe-area-context'
import Icon from 'react-native-vector-icons/FontAwesome5'
import {ms} from 'react-native-size-matters'

import {Colors} from '@bluecentury/styles'
import {IconButton} from '@bluecentury/components'
import {icons} from '@bluecentury/assets'
import {useEntity, useMap} from '@bluecentury/stores'

type Props = NativeStackScreenProps<RootStackParamList>

export default function Formations({navigation}: Props) {
  const {activeFormations, getActiveFormations} = useMap()
  const {vesselId} = useEntity()
  const [dropOffModal, setDropOffModal] = useState(false)
  const [selectedBarge, setSelectedBarge] = useState(null)

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <IconButton source={icons.qr} onPress={() => navigation.goBack()} />
      )
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
        <Text fontWeight="bold" color="#23272F">
          {name}
        </Text>
        <TouchableOpacity onPress={() => onUnlinkPress(item)}>
          <Icon name="unlink" size={20} color={Colors.azure} />
        </TouchableOpacity>
      </HStack>
    )
  }

  const onUnlinkPress = (barge: any) => {
    console.log(barge)
    setDropOffModal(true)
    setSelectedBarge(item)
  }

  const bargeName =
    selectedBarge?.entity?.alias !== null
      ? selectedBarge?.entity?.alias
      : selectedBarge?.entity?.name
  return (
    <SafeAreaView style={{flex: 1}}>
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
          borderTopRightRadius: 15
        }}
      />
      <Modal isOpen={true}>
        <Modal.Content width="95%" px={ms(10)}>
          <Modal.Header>Drop off</Modal.Header>
          <Modal.Body>
            Would you like to drop off{' '}
            <Text fontWeight="medium" color={Colors.primary}>
              {bargeName}
            </Text>{' '}
          </Modal.Body>
          <Modal.Footer>
            <HStack flex={1} justifyContent="space-between">
              <Button
                flex={1}
                backgroundColor={Colors.light}
                onPress={() => setDropOffModal(false)}
              >
                Cancel
              </Button>
              <Spacer />
              <Button flex={1} backgroundColor={Colors.primary}>
                Drop off
              </Button>
            </HStack>
          </Modal.Footer>
        </Modal.Content>
      </Modal>
    </SafeAreaView>
  )
}
