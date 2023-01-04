import React, {FC} from 'react'
import {TouchableOpacity} from 'react-native'
import {Box, HStack, Avatar, VStack, Text, Button, Spacer} from 'native-base'
import {ms} from 'react-native-size-matters'

import {Colors} from '@bluecentury/styles'
import {PROD_URL} from '@vemasys/env'
import {IconButton} from '../IconButton'
import {Icons} from '@bluecentury/assets'
import {titleCase} from '@bluecentury/constants'
import {useTranslation} from 'react-i18next'

type IProps = {
  item: any
  selected: boolean | string
  onPress: () => void
  onPressAcceptPendingRole: (id: string, accept: boolean) => void
}
export const EntityCard: FC<IProps> = ({
  item,
  selected,
  onPress,
  onPressAcceptPendingRole,
}) => {
  const {t} = useTranslation()
  return (
    <Box
      key={item?.id}
      pl="4"
      pr="5"
      py="2"
      my="1.5"
      bg="#fff"
      shadow={1}
      borderColor={
        !item?.hasUserAccepted && item?.hasUserAccepted !== undefined
          ? '#F9790B'
          : selected
          ? Colors.secondary
          : '#F0F0F0'
      }
      borderStyle={
        !item?.hasUserAccepted && item?.hasUserAccepted !== undefined
          ? 'dashed'
          : 'solid'
      }
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
                : '',
            }}
          />
          <VStack>
            <Text bold>{item?.entity?.alias}</Text>
            <Text color={Colors.primary} fontWeight="medium">
              {titleCase(item?.role?.title)}
            </Text>
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
                {t('active')}
              </Text>
            </Button>
          ) : !item?.hasUserAccepted && item?.hasUserAccepted !== undefined ? (
            <HStack>
              <IconButton
                source={Icons.status_x}
                onPress={() => onPressAcceptPendingRole(item?.id, false)}
                size={ms(30)}
                styles={{marginRight: 10}}
              />
              <IconButton
                source={Icons.status_check}
                onPress={() => onPressAcceptPendingRole(item?.id, true)}
                size={ms(30)}
              />
            </HStack>
          ) : null}
        </HStack>
      </TouchableOpacity>
    </Box>
  )
}
