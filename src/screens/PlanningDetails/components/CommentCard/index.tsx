import React from 'react'
import {FlatList, TouchableOpacity, Image, StyleSheet} from 'react-native'
import {Avatar, Box, HStack, Text} from 'native-base'
import {ms} from 'react-native-size-matters'
import moment from 'moment'

import {Colors} from '@bluecentury/styles'
import {PROD_URL} from '@vemasys/env'

interface ICommentCard {
  comment: any
  commentDescription: string
  onCommentPress: () => void
  onCommentImagePress: (file: ImageFile) => void
  images?: any[]
}
const CommentCard = ({
  comment,
  commentDescription,
  onCommentPress,
  onCommentImagePress,
  images,
}: ICommentCard) => {
  let imgLinks: string[] = []
  const getAttrFromString = (str: string) => {
    let regex = /<img.*?src='(.*?)'/gi,
      result,
      res = []
    while ((result = regex.exec(str))) {
      res.push(result[1])
    }
    imgLinks = res
  }
  if (comment && comment.description) {
    getAttrFromString(comment.description)
  }
  return (
    <TouchableOpacity activeOpacity={0.6} onPress={onCommentPress}>
      <Box
        bg={Colors.white}
        borderColor={Colors.light}
        borderRadius={5}
        borderWidth={1}
        mt={ms(10)}
        p={ms(16)}
        shadow={2}
      >
        <HStack alignItems="center">
          <Avatar
            source={{
              uri: comment?.user?.icon?.path
                ? `${PROD_URL}/upload/documents/${comment?.user?.icon?.path}`
                : '',
            }}
            size="48px"
          />
          <Box ml={ms(10)}>
            <Text bold>
              {comment?.user ? comment?.user?.firstname : ''}{' '}
              {comment?.user ? comment?.user?.lastname : ''}
            </Text>
            <Text color={Colors.disabled} fontWeight="medium">
              {moment(comment?.creationDate).format('DD MMM YYYY')}
            </Text>
          </Box>
        </HStack>
        <Text fontSize={ms(13)} mt={ms(5)}>
          {commentDescription}
        </Text>
        {imgLinks.length > 0 ? (
          <FlatList
            horizontal
            renderItem={image => {
              const file = {
                uri: image.item,
                fileName: image.item,
                type: 'image/jpeg',
              }
              return (
                <TouchableOpacity onPress={() => onCommentImagePress(file)}>
                  {/* <Image
                    alt="file-upload"
                    source={{uri: image.item}}
                    w={ms(136)}
                  /> */}
                  <Image
                    // alt="file-upload"
                    source={{uri: image.item}}
                    style={styles.image}
                  />
                </TouchableOpacity>
              )
            }}
            data={imgLinks}
            keyExtractor={item => item}
            removeClippedSubviews={true}
            scrollEventThrottle={16}
            showsHorizontalScrollIndicator={false}
          />
        ) : null}
        {images && images.length > 0 ? (
          <FlatList
            horizontal
            renderItem={image => {
              return (
                <TouchableOpacity>
                  <Image
                    // alt="file-upload"
                    source={{uri: image.item.uri}}
                    style={styles.image}
                  />
                </TouchableOpacity>
              )
            }}
            // maxH={ms(120)}
            data={images}
            keyExtractor={item => item}
            removeClippedSubviews={true}
            scrollEventThrottle={16}
            showsHorizontalScrollIndicator={false}
          />
        ) : null}
      </Box>
    </TouchableOpacity>
  )
}

export default CommentCard

const styles = StyleSheet.create({
  image: {
    height: ms(114),
    width: ms(136),
    marginRight: ms(10),
  },
})
