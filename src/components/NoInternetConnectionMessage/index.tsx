import React from 'react'
import {Text, Alert, Spinner} from 'native-base'
import {useSettings, useEntity} from '@bluecentury/stores'
import {Colors} from '@bluecentury/styles'
import {ms} from 'react-native-size-matters'
import MaterialIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import {StyleSheet} from 'react-native'
import {uploadComment} from '@bluecentury/utils'
import {CommentWaitingForUpload} from '@bluecentury/models'

export const NoInternetConnectionMessage = () => {
  const isOnline = useSettings().isOnline
  const areCommentsUploading = useEntity().areCommentsUploading
  const uploadingCommentNumber = useEntity().uploadingCommentNumber
  const commentsWaitingForUpload = useEntity().commentsWaitingForUpload
  const rejectedComments = useEntity().rejectedComments
  const setAreCommentsUploading = useEntity().setAreCommentsUploading
  const setUploadingCommentNumber = useEntity().setUploadingCommentNumber
  const setRejectedComments = useEntity().setRejectedComments

  const retryUpload = (comments: CommentWaitingForUpload[]) => {
    setAreCommentsUploading(true)

    let uploadingItemNumber = 0

    const requestsForCommentsUpload = async () => {
      for (const item of comments) {
        setUploadingCommentNumber(uploadingItemNumber + 1)
        uploadingItemNumber += 1
        try {
          await uploadComment(
            item.method,
            item.routeFrom,
            item.description,
            item.imgFile,
            item.attachedImgs,
            item.showToast,
            undefined,
            item.navlogId
          )
        } catch (e) {
          console.log(e)
        }
      }
    }

    requestsForCommentsUpload().then(() => {
      setRejectedComments('clear')
      setAreCommentsUploading(false)
      setUploadingCommentNumber(0)
    })
  }
  //This block works if we are uploading comments right now.
  if (isOnline && areCommentsUploading) {
    return (
      <Alert
        backgroundColor={Colors.primary}
        borderRadius="0"
        display="flex"
        flexDirection="row"
        justifyContent="center"
      >
        <Spinner color={Colors.white} pr={2} />
        <Text color={Colors.white} fontSize={ms(14)} fontWeight="medium">
          Uploading comments ({uploadingCommentNumber}/
          {commentsWaitingForUpload.length
            ? commentsWaitingForUpload.length
            : rejectedComments.length}
          )
        </Text>
      </Alert>
    )
  }
  //This block works if we have rejectedComments.length,it displays retry element
  if (rejectedComments.length && isOnline) {
    return (
      <Alert
        backgroundColor={Colors.offlineWarning}
        borderRadius="0"
        display="flex"
        flexDirection="row"
        justifyContent="center"
      >
        {/*TODO insert icon*/}
        <Text color={Colors.white} fontSize={ms(14)} fontWeight="medium">
          ({rejectedComments.length}) comments failed to upload.
        </Text>
        <Text
          color={Colors.white}
          fontSize={ms(14)}
          fontWeight="medium"
          onPress={() => {
            retryUpload(rejectedComments)
          }}
        >
          Retry
        </Text>
      </Alert>
    )
  }
  //Block that displays offline banner
  return !isOnline ? (
    <Alert
      backgroundColor={Colors.offlineWarning}
      borderRadius="0"
      display="flex"
      flexDirection="row"
      justifyContent="center"
    >
      <MaterialIcons
        color={Colors.white}
        name="wifi-off"
        size={ms(20)}
        style={styles.iconStyle}
      />
      <Text color={Colors.white} fontSize={ms(14)} fontWeight="medium">
        Offline mode. No internet connection.
      </Text>
    </Alert>
  ) : null
}

const styles = StyleSheet.create({
  iconStyle: {
    marginRight: ms(16),
  },
})
