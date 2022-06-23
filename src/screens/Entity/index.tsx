import React, {useEffect} from 'react'
import {RefreshControl} from 'react-native'
import {Box, FlatList, Heading, Divider, Button, Image} from 'native-base'
import {CommonActions} from '@react-navigation/native'
import {NativeStackScreenProps} from '@react-navigation/native-stack'
import {ms} from 'react-native-size-matters'
import {useEntity, useAuth} from '@bluecentury/stores'
import {icons} from '@bluecentury/assets'
import {Colors} from '@bluecentury/styles'
import {EntityCard, LoadingIndicator} from '@bluecentury/components'

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
  const {logout, isLoggingOut} = useAuth()
  useEffect(() => {
    getUserInfo()
    getEntityUsers()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  const onSelectEntityUser = (entity: any) => {
    selectEntityUser(entity)
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{name: 'Main'}]
      })
    )
  }
  const onPullToReload = () => {
    getUserInfo()
    getEntityUsers()
  }
  const handleOnPressLogout = () => {
    logout()
  }
  return (
    <Box flex={1} bgColor="red" safeArea>
      <Box
        flex={1}
        pt={ms(20)}
        px={ms(20)}
        backgroundColor="#"
        borderTopRightRadius={15}
        borderTopLeftRadius={15}
      >
        <Heading fontSize="xl" pb="2">
          Roles
        </Heading>
        <Divider mb="5" />
        {isLoadingEntityUsers ? (
          <LoadingIndicator />
        ) : (
          <FlatList
            refreshControl={
              <RefreshControl
                onRefresh={onPullToReload}
                refreshing={isLoadingEntityUsers}
              />
            }
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
            // contentContainerStyle={{paddingBottom: 120}}
            showsVerticalScrollIndicator={false}
          />
        )}
      </Box>
      <Box bg={Colors.white}>
        <Divider />
        <Button
          m={ms(20)}
          bg={Colors.danger}
          isLoading={isLoggingOut}
          _loading={{
            opacity: 0.5,
            bg: Colors.danger,
            _text: {
              bold: true
            }
          }}
          _spinner={{
            size: ms(20),
            color: Colors.white
          }}
          isLoadingText="Logging out"
          leftIcon={
            <Image
              alt="logout-img"
              source={icons.logout}
              resizeMode="contain"
              size={ms(20)}
            />
          }
          onPress={handleOnPressLogout}
        >
          Log out
        </Button>
      </Box>
    </Box>
  )
}
