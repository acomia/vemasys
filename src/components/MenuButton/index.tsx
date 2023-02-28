import React from 'react'
import {
  Button,
  Image,
  IButtonProps,
  Box,
  Text,
  Badge,
  VStack,
} from 'native-base'
import {ImageSourcePropType} from 'react-native'
import {ms} from 'react-native-size-matters'
import {Colors} from '@bluecentury/styles'

interface Props extends IButtonProps {
  active: boolean
  children: React.ReactNode
  iconSource: ImageSourcePropType
  rightIcon?: ImageSourcePropType
  badge?: number
}

const MenuButton = ({
  active,
  children,
  iconSource,
  rightIcon,
  badge,
  ...props
}: Props) => {
  return (
    <Button
      _light={{
        colorScheme: 'azure',
        _pressed: {
          bg: Colors.primary,
          tintColor: Colors.white,
          _text: {
            color: Colors.white,
          },
        },
        _text: {
          color: active
            ? Colors.white
            : props.disabled
            ? 'gray.400'
            : Colors.text,
          fontWeight: '500',
          paddingLeft: ms(15),
        },
      }}
      leftIcon={
        badge ? (
          <VStack>
            <Badge // bg="red.400"
              _text={{
                fontSize: 12,
              }}
              alignSelf="flex-end"
              colorScheme="danger"
              mb={-4}
              mr={-4}
              rounded="full"
              variant="solid"
              zIndex={1}
            >
              {badge}
            </Badge>
            <Image
              tintColor={
                active
                  ? Colors.white
                  : props.disabled
                  ? 'gray.400'
                  : Colors.text
              }
              alt="Menu Icon"
              resizeMode="contain"
              size={ms(20)}
              source={iconSource}
            />
          </VStack>
        ) : (
          <Image
            tintColor={
              active ? Colors.white : props.disabled ? 'gray.400' : Colors.text
            }
            alt="Menu Icon"
            resizeMode="contain"
            size={ms(20)}
            source={iconSource}
          />
        )
      }
      rightIcon={
        rightIcon !== undefined ? (
          <Image
            alt="Right Icon"
            ml={ms(10)}
            resizeMode="contain"
            size={ms(20)}
            source={rightIcon}
          />
        ) : (
          <></>
        )
      }
      bg={active ? Colors.primary : 'transparent'}
      justifyContent="flex-start"
      size="md"
      variant="solid"
      {...props}
    >
      {children}
    </Button>
  )
}

export default MenuButton
