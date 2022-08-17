import React, {FC} from 'react'
import {TouchableOpacity} from 'react-native'
import {Box, HStack, Avatar, VStack, Text, Button, Spacer} from 'native-base'
import {ms} from 'react-native-size-matters'

import {Colors} from '@bluecentury/styles'
import {PROD_URL} from '@vemasys/env'

type IProps = {
  item: any
  selected: boolean | string
  onPress: () => void
}
export const EntityCard: FC<IProps> = ({item, selected, onPress}) => {
  return (
    <Box
      key={item?.id}
      pl="4"
      pr="5"
      py="2"
      my="1.5"
      bg="#fff"
      shadow={'1'}
      borderColor="#F0F0F0"
      borderWidth="1"
      borderRadius="md"
    >
      <TouchableOpacity activeOpacity={0.7} onPress={onPress}>
        <HStack space={3} justifyContent="space-between">
          <Avatar
            size="48px"
            source={{
              uri: item?.entity?.icon
                ? `${PROD_URL}/upload/documents/${item?.entity?.icon?.path}`
                : ''
            }}
          />
          <VStack>
            <Text bold>{item?.entity?.alias}</Text>
            <Text color={Colors.primary}>{item?.role?.title}</Text>
          </VStack>
          <Spacer />
          {selected ? (
            <Button
              size="xs"
              h={ms(24)}
              py="1"
              alignSelf="center"
              textAlign="center"
              backgroundColor={Colors.secondary}
            >
              <Text fontSize={ms(12)} color="#fff" bold>
                active
              </Text>
            </Button>
          ) : null}
        </HStack>
      </TouchableOpacity>
    </Box>
  )
}
