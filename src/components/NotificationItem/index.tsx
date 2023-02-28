import React from 'react'
import {TouchableOpacity} from 'react-native'
import moment from 'moment/moment'
import {Box, HStack, Text, VStack} from 'native-base'
import {ms} from 'react-native-size-matters'
import Icon from 'react-native-vector-icons/FontAwesome5'
import IconMCI from 'react-native-vector-icons/MaterialCommunityIcons'
import {useTranslation} from 'react-i18next'
import {Dimensions} from 'react-native'
import {Icons} from '@bluecentury/assets'
import {IconButton} from '@bluecentury/components'
import {useNotif} from '@bluecentury/stores'
import {Colors} from '@bluecentury/styles'

interface Item {
  createdAt: string
  icon: string
  id: number
  label: string
  read: boolean
  stubborn: boolean
  type: string
}

interface Props {
  item: Item
}

const screenWidth = Dimensions.get('screen').width

export const NotificationItem = ({item}: Props) => {
  const {t} = useTranslation()
  const {readNotif} = useNotif()

  const sanitizedIcon = (icon: string) => {
    return icon.replace('fas fa-', '')
  }

  const sanitizedHTML = (labelHTML: string) => {
    const labelHTMLMatch = labelHTML.match(/<a\/?[^>](.*?)<\/a>/g)
    const subject =
      labelHTMLMatch == null
        ? ''
        : labelHTMLMatch.map(function (str) {
            return str.replace(/<\/?[^>]+(>|$)/g, '')
          })

    let notification: string | RegExp | string[] = labelHTML.replace(
      /<\/?[^>]+(>|$)/g,
      ''
    )

    notification = notification.replace(subject[0], ':::')
    notification = notification.split(':::')

    return (
      <Text>
        {notification[0] ? notification[0] : ''}
        <Text bold color={Colors.highlighted_text}>
          {subject}
        </Text>
        {notification[1] ? notification[1] : ''}
      </Text>
    )
  }

  const renderIcon = (icon: string) => {
    if (!icon) return null

    switch (icon) {
      case 'fas fa-file-certificate':
        return (
          <IconMCI
            color={Colors.azure}
            name={sanitizedIcon(icon)}
            size={30}
            style={{marginHorizontal: 5}}
          />
        )
      case 'fas fa-books':
        return (
          <IconButton
            size={ms(30)}
            source={Icons?.books}
            styles={{marginHorizontal: 5}}
            onPress={() => {
              return null
            }}
          />
        )
      default:
        return (
          <Icon
            color={Colors.azure}
            name={sanitizedIcon(icon)}
            size={24}
            style={{marginHorizontal: 5}}
          />
        )
    }
  }

  return (
    // Added press for the redirection
    // as for now it is for update the notification to read
    <TouchableOpacity
      onPress={() => {
        readNotif(item?.id, !item?.read)
        // markAllAsReadNotif()
      }}
    >
      <HStack
        alignItems="center"
        backgroundColor={Colors.white}
        bg={Colors.white}
        borderColor={!item.read ? Colors.border : Colors.grey}
        borderRadius={ms(5)}
        borderWidth={ms(1)}
        my={ms(8)}
        px={ms(16)}
        py={ms(10)}
        shadow={'1'}
      >
        {renderIcon(item.icon)}
        <VStack pl="10px">
          <Text maxWidth={screenWidth - 100}>{sanitizedHTML(item.label)}</Text>
          <Text color={Colors.disabled} fontSize={ms(12)}>
            {moment(item.createdAt).isSame(moment(), 'day')
              ? `${t('today')} | ${moment
                  .parseZone(item.createdAt)
                  .format('HH:mm')}`
              : moment.parseZone(item.createdAt).format('MMM DD, YYYY HH:mm')}
          </Text>
        </VStack>
        {!item.read && (
          <Box
            backgroundColor={Colors.blue}
            borderBottomLeftRadius={ms(5)}
            borderTopLeftRadius={ms(5)}
            bottom="0"
            left="0"
            position={'absolute'}
            top="0"
            width="8px"
          />
        )}
      </HStack>
    </TouchableOpacity>
  )
}
