import React from 'react'
import {
  Avatar,
  Box,
  Button,
  Center,
  HStack,
  Spacer,
  Text,
  VStack,
} from 'native-base'
import {ScrollView, TouchableOpacity} from 'react-native'
import {Divider} from 'native-base'
import {Colors} from '@bluecentury/styles'
import {ms} from 'react-native-size-matters'
import {IconButton} from '@bluecentury/components'
import {Icons} from '@bluecentury/assets'
import {useTranslation} from 'react-i18next'

const UserRequests = () => {
  const {t} = useTranslation()
  const renderItem = () => {
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
        <TouchableOpacity activeOpacity={0.7} onPress={() => {}}>
          <HStack justifyContent="space-between" space={3}>
            <Avatar
              size="48px"
              source={{uri: 'https://picsum.photos/200/300'}}
              // source={{
              //   uri: item?.entity?.icon
              //     ? `${PROD_URL}/upload/documents/${item?.entity?.icon?.path}`
              //     : '',
              // }}
            />
            <VStack>
              <Text bold>
                {/*{item?.entity?.alias}*/}
                Name
              </Text>
              <Text color={Colors.primary} fontWeight="medium">
                {/*{titleCase(item?.role?.title)}*/}
                Role
              </Text>
            </VStack>
            <Spacer />
            <HStack>
              <IconButton
                size={ms(30)}
                source={Icons.status_x}
                styles={{marginRight: 10}}
                onPress={() => {}}
              />
              <IconButton
                size={ms(30)}
                source={Icons.status_check}
                onPress={() => {}}
              />
            </HStack>
          </HStack>
        </TouchableOpacity>
      </Box>
    )
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
        <Button m={0} p={0} variant="link" onPress={() => {}}>
          {t('clickToRefresh')}
        </Button>
      </HStack>
      <Divider mb="5" mt="2" />
      <ScrollView>
        {renderItem()}
      </ScrollView>
    </Box>
  )
}

export default UserRequests
