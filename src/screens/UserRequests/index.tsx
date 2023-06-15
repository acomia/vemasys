import React from 'react'
import {Avatar, Box, Button, HStack, Spacer, Text, VStack} from 'native-base'
import {ScrollView} from 'react-native'
import {Divider} from 'native-base'
import {Colors} from '@bluecentury/styles'
import {ms} from 'react-native-size-matters'
import {IconButton, LoadingAnimated} from '@bluecentury/components'
import {Icons} from '@bluecentury/assets'
import {useTranslation} from 'react-i18next'
import {useEntity} from '@bluecentury/stores'
import {PROD_URL} from '@vemasys/env'

const UserRequests = () => {
  const {t} = useTranslation()
  const {
    entityId,
    usersWaitingForApprove,
    updatePendingUser,
    getUsersWaitingForApprove,
    loadingUsersWaitingForApprove,
  } = useEntity()
  const renderItem = (name: string, role: string, id: number, icon: any) => {
    return (
      <Box
        // key={item?.id}
        bg="#fff"
        borderColor="#F9790B"
        borderRadius="md"
        borderStyle="dashed"
        borderWidth="1"
        my="1.5"
        pl="4"
        pr="5"
        py="2"
        shadow={5}
      >
        <HStack justifyContent="space-between" space={3}>
          <Avatar
            source={{
              uri: icon ? `${PROD_URL}/upload/documents/${icon.path}` : '',
            }}
            size="48px"
          />
          <VStack>
            <Text bold>{name}</Text>
            <Text color={Colors.primary} fontWeight="medium">
              {role}
            </Text>
          </VStack>
          <Spacer />
          <HStack>
            <IconButton
              size={ms(30)}
              source={Icons.status_x}
              styles={{marginRight: 10}}
              onPress={() => {
                updatePendingUser(id, false)
                if (entityId) {
                  getUsersWaitingForApprove(entityId)
                }
              }}
            />
            <IconButton
              size={ms(30)}
              source={Icons.status_check}
              onPress={() => {
                updatePendingUser(id, true)
                if (entityId) {
                  getUsersWaitingForApprove(entityId)
                }
              }}
            />
          </HStack>
        </HStack>
      </Box>
    )
  }
  if (loadingUsersWaitingForApprove) {
    return <LoadingAnimated />
  }
  return (
    <Box
      backgroundColor={Colors.white}
      borderRadius="20"
      flex={1}
      pt={8}
      px={4}
    >
      <HStack justifyContent={'space-between'}>
        <Text bold>{t('users')}</Text>
        <Button
          m={0}
          p={0}
          variant="link"
          onPress={() => {
            if (entityId) {
              getUsersWaitingForApprove(entityId)
            }
          }}
        >
          {t('clickToRefresh')}
        </Button>
      </HStack>
      <Divider mb="5" mt="2" />
      {usersWaitingForApprove.length ? (
        <ScrollView>
          {usersWaitingForApprove.map(user => {
            return renderItem(
              `${user.user.firstname} ${user.user.lastname}`,
              user.role.title,
              user.id,
              user.user.icon
            )
          })}
        </ScrollView>
      ) : (
        <Text bold alignSelf="center">
          There's no users waiting for approve
        </Text>
      )}
    </Box>
  )
}

export default UserRequests
