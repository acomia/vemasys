import React, {useState} from 'react'
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
  Box,
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
  callback: (val?: any) => void
  switchState?: boolean
  language?: string
  isEntireBlockPressable?: boolean
  disabled?: boolean
  badgeValue?: number
}

const SettingsItem = (props: Props) => {
  const {t} = useTranslation()
  const {
    type,
    value,
    iconSource,
    callback,
    switchState,
    language,
    isEntireBlockPressable,
    badgeValue,
  } = props
  const [isSelection, setIsSelection] = useState(false)

  const languageIcon = (lang: string) => {
    switch (lang) {
      case 'en':
        return Icons.english
      // case 'nl':
      // return Icons.dutch
      case 'fr':
        return Icons.french
      // case 'de':
      // return Icons.german
      default:
        break
    }
  }

  const languageName = (shortName: string) => {
    switch (shortName) {
      case 'en':
        return t('english')
      // case 'nl':
      // return t('dutch')
      case 'fr':
        return t('french')
      // case 'de':
      // return t('german')
      default:
        break
    }
  }

  const languageSelect = () => {
    return (
      <Menu
        trigger={triggerProps => {
          return (
            <Pressable
              accessibilityLabel="More options menu"
              h="100%"
              pt={ms(18)}
              {...triggerProps}
            >
              {isSelection ? (
                <ChevronUpIcon color={Colors.text} mr={ms(10)} size="4" />
              ) : (
                <ChevronDownIcon color={Colors.text} mr={ms(10)} size="4" />
              )}
            </Pressable>
          )
        }}
        placement="bottom left"
        w="400"
        onClose={() => setIsSelection(false)}
        onOpen={() => setIsSelection(true)}
      >
        <Menu.Item
          w="100%"
          onPress={() => {
            callback('en')
          }}
        >
          <HStack>
            <Image alt="Company Logo" mr={ms(13)} source={Icons.english} />
            <Text>{t('english')}</Text>
          </HStack>
        </Menu.Item>
        {/* <Menu.Item
          onPress={() => {
            callback('nl')
          }}
        >
          <HStack>
            <Image source={Icons.dutch} mr={ms(13)} alt="Company Logo" />
            <Text>{t('dutch')}</Text>
          </HStack>
        </Menu.Item> */}
        <Menu.Item
          onPress={() => {
            callback('fr')
          }}
        >
          <HStack>
            <Image alt="Company Logo" mr={ms(13)} source={Icons.french} />
            <Text>{t('french')}</Text>
          </HStack>
        </Menu.Item>
        {/* <Menu.Item
          onPress={() => {
            callback('de')
          }}
        >
          <HStack>
            <Image source={Icons.german} mr={ms(13)} alt="Company Logo" />
            <Text>{t('german')}</Text>
          </HStack>
        </Menu.Item> */}
      </Menu>
    )
  }

  const renderItem = (itemType: string) => {
    console.log('props.disabled', props.disabled)
    if (itemType === 'switch') {
      return (
        <Switch
          defaultIsChecked
          colorScheme="primary"
          disabled={props.disabled}
          isChecked={switchState}
          onToggle={() => callback(!switchState)}
        />
      )
    }
    if (itemType === 'navigation') {
      return (
        <IconButton
          icon={<ChevronRightIcon color={Colors.text} size="4" />}
          onPress={() => callback()}
        />
      )
    }
    if (itemType === 'select') {
      return languageSelect()
    }
  }

  return (
    <Pressable
      borderRadius="15"
      overflow="hidden"
      pb={ms(12)}
      width="100%"
      onPress={isEntireBlockPressable ? () => callback() : null}
    >
      <HStack
        alignItems="center"
        backgroundColor={Colors.white}
        borderColor={Colors.light}
        borderRadius="15"
        borderWidth="1"
        justifyContent={'space-between'}
        pl={ms(12)}
        pr={ms(24)}
        shadow="3"
      >
        <HStack alignItems={'center'}>
          {type === 'select' ? (
            <Image
              key={language}
              alt="Company Logo"
              h={ms(17)}
              mr={ms(12)}
              my={ms(20)}
              resizeMode="contain"
              source={languageIcon(language)}
              w={ms(17)}
            />
          ) : (
            <Image
              alt="Company Logo"
              h={ms(17)}
              mr={ms(12)}
              my={ms(20)}
              resizeMode="contain"
              source={iconSource}
              w={ms(17)}
            />
          )}
          <Text color={Colors.text} fontWeight="500">
            {type === 'select' ? languageName(language) : value}
          </Text>
          {badgeValue && badgeValue > 0 ? (
            <Box
              backgroundColor={Colors.azure}
              borderRadius={50}
              minW={ms(10)}
              ml={ms(6)}
              px={ms(7)}
              py={ms(0)}
            >
              <Text color={Colors.white}>{badgeValue}</Text>
            </Box>
          ) : null}
        </HStack>
        {renderItem(type)}
      </HStack>
    </Pressable>
  )
}

export default SettingsItem
