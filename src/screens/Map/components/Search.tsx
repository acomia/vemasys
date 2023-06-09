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
  isKeyboardVisible?: boolean
}

export default ({
  onBlur,
  onFocus,
  setIsSearchPin,
  handleItemAction,
  isKeyboardVisible,
}: Props) => {
  const {t} = useTranslation()
  const [searchValue, setSearchValue] = useState('')
  const [isItemPressed, setItemPressed] = useState(false)
  const {
    isSearchLoading,
    searchLocations,
    geographicLocation,
    unmountLocations,
    getSearchLocations,
  } = useMap()

  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchValue && !isItemPressed) {
        getSearchLocations(searchValue)
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
    <Box bgColor={Colors.white} borderRadius={5}>
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
      {searchLocations.length > 0 && (
        <FlatList
          data={searchLocations}
          keyExtractor={(item, index) => index.toString()}
          keyboardShouldPersistTaps="always"
          px={ms(5)}
          renderItem={renderLocations}
          style={{height: isKeyboardVisible ? '70%' : '60%'}}
        />
      )}
    </Box>
  )
}
