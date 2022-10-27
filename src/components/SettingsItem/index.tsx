import React, {useState, useEffect} from 'react'
import {
  Pressable,
  HStack,
  Image,
  Switch,
  Text,
  IconButton,
  ChevronRightIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  Menu,
} from 'native-base'
import {ms} from 'react-native-size-matters'
import {Colors} from '@bluecentury/styles'
import {ImageSourcePropType} from 'react-native'
import {Icons} from '@bluecentury/assets'

interface Props {
  type: string
  value: string
  iconSource: ImageSourcePropType
  callback: Function
  switchState?: boolean
  language?: string
}

const SettingsItem = (props: Props) => {
  const {type, value, iconSource, callback, switchState, language} = props
  const [isSelection, setIsSelection] = useState(false)
  const [selectedValue, setSelectedValue] = useState('')

  useEffect(() => {
    if (language && type === 'select') {
      setSelectedValue(language)
    }
  }, [])

  const languageIcon = (lang: string) => {
    switch (lang) {
      case 'English':
        return Icons.english
      case 'Dutch':
        return Icons.dutch
      case 'French':
        return Icons.french
      case 'German':
        return Icons.german
      default:
        break
    }
  }

  const languageSelect = () => {
    return (
      <Menu
        w="400"
        placement="bottom left"
        onOpen={() => setIsSelection(true)}
        onClose={() => setIsSelection(false)}
        trigger={triggerProps => {
          return (
            <Pressable
              accessibilityLabel="More options menu"
              pt={ms(18)}
              h="100%"
              {...triggerProps}
            >
              {isSelection ? (
                <ChevronUpIcon size="4" color={Colors.text} mr={ms(10)} />
              ) : (
                <ChevronDownIcon size="4" color={Colors.text} mr={ms(10)} />
              )}
            </Pressable>
          )
        }}
      >
        <Menu.Item
          w="100%"
          onPress={() => {
            callback('English')
            setSelectedValue('English')
          }}
        >
          <HStack>
            <Image source={Icons.english} mr={ms(13)} alt="Company Logo" />
            <Text>English</Text>
          </HStack>
        </Menu.Item>
        <Menu.Item
          onPress={() => {
            callback('Dutch')
            setSelectedValue('Dutch')
          }}
        >
          <HStack>
            <Image source={Icons.dutch} mr={ms(13)} alt="Company Logo" />
            <Text>Dutch</Text>
          </HStack>
        </Menu.Item>
        <Menu.Item
          onPress={() => {
            callback('French')
            setSelectedValue('French')
          }}
        >
          <HStack>
            <Image source={Icons.french} mr={ms(13)} alt="Company Logo" />
            <Text>French</Text>
          </HStack>
        </Menu.Item>
        <Menu.Item
          onPress={() => {
            callback('German')
            setSelectedValue('German')
          }}
        >
          <HStack>
            <Image source={Icons.german} mr={ms(13)} alt="Company Logo" />
            <Text>German</Text>
          </HStack>
        </Menu.Item>
      </Menu>
    )
  }

  const renderItem = (itemType: string) => {
    if (itemType === 'switch') {
      return (
        <Switch
          defaultIsChecked
          colorScheme="primary"
          isChecked={switchState}
          onToggle={callback}
        />
      )
    }
    if (itemType === 'navigation') {
      return (
        <IconButton
          onPress={() => callback()}
          icon={<ChevronRightIcon color={Colors.text} size="4" />}
        />
      )
    }
    if (itemType === 'select') {
      return languageSelect()
    }
  }

  return (
    <Pressable overflow="hidden" borderRadius="15" width="100%" pb={ms(12)}>
      <HStack
        justifyContent={'space-between'}
        alignItems="center"
        pl={ms(12)}
        pr={ms(24)}
        borderWidth="1"
        borderColor={Colors.light}
        borderRadius="15"
        backgroundColor={Colors.white}
        shadow="3"
      >
        <HStack alignItems={'center'}>
          {type === 'select' ? (
            <Image
              key={selectedValue}
              alt="Company Logo"
              source={languageIcon(selectedValue)}
              resizeMode="contain"
              w={ms(17)}
              h={ms(17)}
              my={ms(20)}
              mr={ms(12)}
            />
          ) : (
            <Image
              alt="Company Logo"
              source={iconSource}
              resizeMode="contain"
              w={ms(17)}
              h={ms(17)}
              my={ms(20)}
              mr={ms(12)}
            />
          )}
          <Text w="70%" color={Colors.text} fontWeight="500">
            {type === 'select' ? selectedValue : value}
          </Text>
        </HStack>
        {renderItem(type)}
      </HStack>
    </Pressable>
  )
}

export default SettingsItem
