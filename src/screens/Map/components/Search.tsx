import React, {useEffect, useState} from 'react'
import {
  KeyboardAvoidingView,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native'
import {Box, Input, Text, Modal, FlatList, Pressable, VStack} from 'native-base'
import {Colors} from '@bluecentury/styles'
import {API} from '@bluecentury/api'
import {useMap} from '@bluecentury/stores'
import {ms} from 'react-native-size-matters'
import IconFA5 from 'react-native-vector-icons/FontAwesome5'
import {useTranslation} from 'react-i18next'

type Props = {
  onBlur?: () => void
  onFocus?: () => void
  setIsSearchPin?: (visible: boolean) => void
  handleItemAction?: (id: any) => void
}

export default ({onBlur, onFocus, setIsSearchPin, handleItemAction}: Props) => {
  const {t} = useTranslation()
  const [searchValue, setSearchValue] = useState('')
  const [isItemPressed, setItemPressed] = useState(false)
  const {
    isSearchLoading,
    searchLocations,
    geographicLocation,
    unmountLocations,
  } = useMap()

  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchValue && !isItemPressed) {
        API.searchMap(searchValue)
      }
    }, 1000)

    return () => {
      clearTimeout(timer)
    }
  }, [searchValue])

  const renderLocations = ({item, index}: any) => {
    return (
      <TouchableOpacity
        key={index}
        // borderRadius={5}
        // mb={ms(5)}
        // px={ms(5)}
        // py={ms(5)}
        style={{marginBottom: ms(5), padding: ms(5)}}
        onPress={() => handleItemPress(item)}
      >
        <Text>{item?.label}</Text>
      </TouchableOpacity>
    )
  }

  const handleItemPress = (item: any) => {
    setItemPressed(true)
    setSearchValue(item?.label)
    handleItemAction(item)
  }

  const clearInput = () => {
    setSearchValue('')
    unmountLocations()
    setItemPressed(false)
    setIsSearchPin(false)
  }

  return (
    <VStack
      bgColor={Colors.white}
      // maxHeight={'50%'}
      borderRadius={5}
      maxHeight={searchLocations.length > 0 ? '78%' : null}
      space={ms(5)}
    >
      <Input
        InputLeftElement={
          <IconFA5
            color={Colors.disabled}
            name="search"
            size={ms(15)}
            style={{paddingLeft: 15}}
          />
        }
        InputRightElement={
          <Box paddingRight={ms(15)}>
            {isSearchLoading ? (
              <ActivityIndicator size={15} />
            ) : (
              <Pressable
                alignItems={'center'}
                height={ms(20)}
                justifyContent={'center'}
                width={ms(20)}
                onPress={clearInput}
              >
                <IconFA5 color={Colors.disabled} name="times" size={ms(15)} />
              </Pressable>
            )}
          </Box>
        }
        borderRadius={5}
        borderWidth={0}
        placeholder={`${t('searchLocation')}`}
        value={searchValue}
        onBlur={() => {
          // unmountLocations()
          onBlur()
        }}
        onChangeText={value => {
          setItemPressed(false)
          setSearchValue(value)
        }}
        onFocus={() => {
          setItemPressed(false)
          onFocus()
        }}
        onSubmitEditing={() => API.searchMap(searchValue)}
      />
      {searchLocations.length > 0 ? (
        <Box>
          <FlatList
            data={searchLocations}
            keyExtractor={(item, index) => index.toString()}
            keyboardShouldPersistTaps="always"
            px={ms(5)}
            renderItem={renderLocations}
            style={{height: ms(80)}}
          />
        </Box>
      ) : null}
    </VStack>
  )
}
