import React, {useEffect, useState} from 'react'
import {ActivityIndicator, TouchableOpacity} from 'react-native'
import {
  Box,
  Input,
  Text,
  FlatList,
  Pressable,
  Button,
  Divider,
} from 'native-base'
import {Colors} from '@bluecentury/styles'
import {useMap} from '@bluecentury/stores'
import {ms} from 'react-native-size-matters'
import IconFA5 from 'react-native-vector-icons/FontAwesome5'
import IconFE from 'react-native-vector-icons/Feather'
import {useTranslation} from 'react-i18next'
import {useNavigation} from '@react-navigation/native'

export default () => {
  const {t} = useTranslation()
  const navigation = useNavigation()
  const [searchValue, setSearchValue] = useState('')
  const {
    isSearchLoading,
    searchLocations,
    geographicLocation,
    unmountLocations,
    getSearchLocations,
    getGeographicPoints,
  } = useMap()

  useEffect(() => {
    navigation.setOptions({
      headerTitle: () => renderSearchInput(),
      headerLeft: () => {
        return (
          <IconFE
            color={Colors.primary}
            name="arrow-left"
            size={ms(20)}
            onPress={() => {
              navigation.goBack()
            }}
          />
        )
      },
    })
  }, [navigation, searchValue])

  const renderSearchInput = () => {
    return (
      <Box
        alignItems={'flex-end'}
        flex={1}
        justifyContent={'flex-end'}
        px={ms(20)}
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
          backgroundColor={Colors.light_blue}
          borderColor={'trasparent'}
          borderRadius={25}
          borderWidth={0}
          height={ms(40)}
          placeholder={`${t('searchLocation')}`}
          value={searchValue}
          width={'full'}
          onChangeText={value => {
            setSearchValue(value)
          }}
          onSubmitEditing={() => getSearchLocations(searchValue)}
        />
      </Box>
    )
  }

  const renderLocations = ({item, index}: any) => {
    return (
      <Box>
        <TouchableOpacity
          key={index}
          style={{
            marginBottom: ms(5),
            padding: ms(5),
            height: ms(50),
            justifyContent: 'center',
          }}
          onPress={() => handleGetSearchPin(item)}
        >
          <Text>{item?.label}</Text>
        </TouchableOpacity>
        <Divider />
      </Box>
    )
  }

  const handleGetSearchPin = (item: any) => {
    setSearchValue(item?.label)
    getGeographicPoints(item?.id)
    navigation.goBack()
  }

  const clearInput = () => {
    setSearchValue('')
    unmountLocations()
  }

  return (
    <Box bgColor={Colors.white} flex={1} pt={ms(20)}>
      <Box flex={1}>
        {searchLocations.length > 0 ? (
          <FlatList
            data={searchLocations}
            keyExtractor={(item, index) => index.toString()}
            keyboardShouldPersistTaps="always"
            px={ms(5)}
            renderItem={renderLocations}
          />
        ) : (
          <Box alignItems={'center'} flex={1} justifyContent={'flex-start'}>
            {isSearchLoading ? (
              <Text>Searching...</Text>
            ) : (
              <Text>Search for terminal locations</Text>
            )}
          </Box>
        )}
      </Box>
      <Box height={ms(80)} px={ms(10)} py={ms(5)} width={'full'}>
        <Button onPress={() => getSearchLocations(searchValue)}>
          <Text color={Colors.white}>Search</Text>
        </Button>
      </Box>
    </Box>
  )
}
