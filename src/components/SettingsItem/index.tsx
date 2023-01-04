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
import {useTranslation} from 'react-i18next'

interface Props {
  type: string
  value: string
  iconSource: ImageSourcePropType
  callback: Function
  switchState?: boolean
  language?: string
}

const SettingsItem = (props: Props) => {
  const {t} = useTranslation()
  const {type, value, iconSource, callback, switchState, language} = props
  const [isSelection, setIsSelection] = useState(false)

  const languageIcon = (lang: string) => {
    switch (lang) {
      case 'en':
        return Icons.english
      case 'nl':
        return Icons.dutch
      case 'fr':
        return Icons.french
      case 'de':
        return Icons.german
      default:
        break
    }
  }

  const languageName = (shortName: string) => {
    switch (shortName) {
      case 'en':
        return t('english')
      case 'nl':
        return t('dutch')
      case 'fr':
        return t('french')
      case 'de':
        return t('german')
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
            callback('en')
          }}
        >
          <HStack>
            <Image source={Icons.english} mr={ms(13)} alt="Company Logo" />
            <Text>{t('english')}</Text>
          </HStack>
        </Menu.Item>
        <Menu.Item
          onPress={() => {
            callback('nl')
          }}
        >
          <HStack>
            <Image source={Icons.dutch} mr={ms(13)} alt="Company Logo" />
            <Text>{t('dutch')}</Text>
          </HStack>
        </Menu.Item>
        <Menu.Item
          onPress={() => {
            callback('fr')
          }}
        >
          <HStack>
            <Image source={Icons.french} mr={ms(13)} alt="Company Logo" />
            <Text>{t('french')}</Text>
          </HStack>
        </Menu.Item>
        <Menu.Item
          onPress={() => {
            callback('de')
          }}
        >
          <HStack>
            <Image source={Icons.german} mr={ms(13)} alt="Company Logo" />
            <Text>{t('german')}</Text>
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
          onToggle={() => callback(!switchState)}
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
              key={language}
              alt="Company Logo"
              source={languageIcon(language)}
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
            {type === 'select' ? languageName(language) : value}
          </Text>
        </HStack>
        {renderItem(type)}
      </HStack>
    </Pressable>
  )
}

export default SettingsItem
