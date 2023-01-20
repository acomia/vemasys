import React from 'react'
import moment from 'moment/moment'
import {Box, HStack, Text, VStack} from 'native-base'
import {ms} from 'react-native-size-matters'
import Icon from 'react-native-vector-icons/FontAwesome5'
import {useTranslation} from 'react-i18next'
import {Dimensions} from 'react-native'

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
        <Text bold color="#29B7EF">
          {subject}
        </Text>
        {notification[1] ? notification[1] : ''}
      </Text>
    )
  }

  return (
    <HStack
      alignItems="center"
      backgroundColor="#fff"
      bg="#fff"
      borderColor={!item.read ? '#BEE3F8' : '#E0E0E0'}
      borderRadius={ms(5)}
      borderWidth={ms(1)}
      my={ms(8)}
      px={ms(16)}
      py={ms(10)}
      shadow={'1'}
    >
      {/* <Image
        alt="notif-img"
        source={Icons.completed}
        width={ms(32)}
        height={ms(32)}
        resizeMode="contain"
      /> */}
      <Icon
        color="#23475C"
        name={sanitizedIcon(item.icon)}
        size={24}
        style={{marginHorizontal: 5}}
      />
      <VStack pl="10px">
        <Text maxWidth={screenWidth - 100}>{sanitizedHTML(item.label)}</Text>
        <Text color="#ADADAD" fontSize={ms(12)}>
          {moment(item.createdAt).isSame(moment(), 'day')
            ? `${t('today')} | ${moment
                .parseZone(item.createdAt)
                .format('HH:mm')}`
            : moment.parseZone(item.createdAt).format('MMM DD, YYYY HH:mm')}
        </Text>
      </VStack>
      {!item.read && (
        <Box
          backgroundColor="#00A3FF"
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
  )
}
