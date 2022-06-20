import React, {useEffect} from 'react'
import {TouchableOpacity, ActivityIndicator} from 'react-native'
import {
  Box,
  FlatList,
  Heading,
  Avatar,
  HStack,
  VStack,
  Text,
  Spacer,
  Divider,
  Button,
  Image,
  Flex
} from 'native-base'
import {CommonActions, useRoute} from '@react-navigation/native'
import {NativeStackScreenProps} from '@react-navigation/native-stack'
import {ms} from 'react-native-size-matters'

import {useEntity, useAuth} from '@bluecentury/stores'
import {icons} from '@bluecentury/assets'
import {Colors} from '@bluecentury/styles'
import {PROD_URL} from '@bluecentury/env'
import {EntityCard} from '@bluecentury/components'

type Props = NativeStackScreenProps<RootStackParamList>

export default function Entity({navigation}: Props) {
  const {
    entityUsers,
    entityUserId,
    isLoadingEntityUsers,
    getUserInfo,
    getEntityUsers,
    selectEntityUser
  } = useEntity()
  const {logout, token} = useAuth()
  const routeName = useRoute().name

  useEffect(() => {
    navigation.setOptions({
      headerBackVisible: false
    })

    // logout()
    if (entityUsers.length === 0) {
      getUserInfo()
      getEntityUsers()
    }
  }, [navigation])

  const onSelectEntityUser = (entity: any) => {
    selectEntityUser(entity)
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{name: 'Main'}]
      })
    )
  }

  const onUserLogout = () => {
    logout()
  }

  return (
    <Flex flex={1} backgroundColor="#F0F0F0">
      <Box
        p="15px"
        backgroundColor="#fff"
        borderTopRightRadius={15}
        borderTopLeftRadius={15}
      >
        <Heading fontSize="xl" pb="2">
          Roles
        </Heading>
        <Divider mb="5" />
        {isLoadingEntityUsers ? (
          <ActivityIndicator size={'large'} />
        ) : (
          <FlatList
            data={entityUsers}
            renderItem={({item}: any) => {
              let selected = entityUserId && item?.id === entityUserId
              return (
                <EntityCard
                  item={item}
                  selected={selected}
                  onPress={() => onSelectEntityUser(item)}
                />
              )
            }}
            keyExtractor={(item: any) => `Entity-${item?.id}`}
            contentContainerStyle={{paddingBottom: 120}}
            showsVerticalScrollIndicator={false}
          />
        )}
      </Box>
      <Box
        position="absolute"
        bottom={ms(0)}
        left={ms(0)}
        right={ms(0)}
        backgroundColor="#fff"
        justifyContent="center"
        padding={ms(15)}
      >
        <Button
          mb={'10px'}
          size={'md'}
          backgroundColor={Colors.danger}
          leftIcon={
            <Image
              alt="logout-img"
              source={icons.logout}
              resizeMode="contain"
              style={{width: 20, height: 20}}
            />
          }
          onPress={onUserLogout}
        >
          Log out
        </Button>
      </Box>
    </Flex>
  )
}
