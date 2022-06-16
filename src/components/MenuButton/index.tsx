import React from 'react'
import {Button, Image, IButtonProps} from 'native-base'
import {ImageSourcePropType} from 'react-native'
import {ms} from 'react-native-size-matters'
import {Colors} from '@bluecentury/styles'

interface Props extends IButtonProps {
  active: boolean
  children: React.ReactNode
  iconSource: ImageSourcePropType
}

const MenuButton = ({active, children, iconSource, ...props}: Props) => {
  return (
    <Button
      size="md"
      _light={{
        colorScheme: 'azure',
        _pressed: {
          bg: Colors.primary,
          tintColor: Colors.white,
          _text: {
            color: Colors.white
          }
        },
        _text: {
          color: active ? Colors.white : Colors.text,
          fontWeight: '500',
          paddingLeft: ms(15)
        }
      }}
      bg={active ? Colors.primary : 'transparent'}
      variant="solid"
      justifyContent="flex-start"
      leftIcon={
        <Image
          alt="Menu Icon"
          source={iconSource}
          size={ms(20)}
          resizeMode="contain"
          tintColor={active ? Colors.white : Colors.text}
        />
      }
      {...props}
    >
      {children}
    </Button>
  )
}

export default MenuButton
