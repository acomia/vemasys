import React, {useEffect, useState} from 'react'
import {KeyboardAvoidingView} from 'react-native'
import {Box, Input, Text, Modal, FlatList, Pressable} from 'native-base'
import {Colors} from '@bluecentury/styles'
import {API} from '@bluecentury/api'
import {useMap} from '@bluecentury/stores'
import {ms} from 'react-native-size-matters'

type Props = {
  isOpen: boolean
  setOpen: (isOpen: boolean) => void
  onAction?: () => void
  value?: any
  header: string
}

export default (props: Props) => {
  const [searchValue, setSearchValue] = useState('')
  const {isSearchLoading, searchLocations, geographicLocation} = useMap()

  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchValue) {
        API.searchMap(searchValue)
      }
    }, 1000)

    return () => {
      clearTimeout(timer)
    }
  }, [searchValue])

  const renderLocations = ({item, index}: any) => {
    return (
      <Pressable
        key={index}
        bgColor={Colors.navLogItemBlue}
        borderRadius={5}
        mb={ms(5)}
        px={ms(5)}
        py={ms(5)}
        onPress={() => {
          API.geographicPoints(item.id)
        }}
      >
        <Text>{item?.label}</Text>
      </Pressable>
    )
  }

  console.log('geographicLocation', geographicLocation)

  return (
    <KeyboardAvoidingView>
      <Modal
        isOpen={props.isOpen}
        onClose={() => {
          props.setOpen(false)
        }}
      >
        <Modal.Content width={'full'}>
          <Modal.Header>
            <Text>{props.header}</Text>
          </Modal.Header>
          <Modal.Body>
            <Input value={searchValue} onChangeText={setSearchValue} />

            <FlatList
              data={searchLocations}
              my={ms(10)}
              renderItem={renderLocations}
            />
          </Modal.Body>
        </Modal.Content>
      </Modal>
    </KeyboardAvoidingView>
  )
}
