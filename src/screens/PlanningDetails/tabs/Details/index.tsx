import React, {useEffect} from 'react'
import {TouchableOpacity} from 'react-native'
import {
  Avatar,
  Box,
  Button,
  HStack,
  Icon,
  Image,
  ScrollView,
  Text
} from 'native-base'
import {ms} from 'react-native-size-matters'
import DatePicker from 'react-native-date-picker'
import {useRoute} from '@react-navigation/native'
import Ionicons from 'react-native-vector-icons/Ionicons'
import moment from 'moment'

import {DatetimePickerList} from '../../components'
import {Colors} from '@bluecentury/styles'
import {Icons} from '@bluecentury/assets'
import {usePlanning} from '@bluecentury/stores'
import {formatLocationLabel} from '@bluecentury/constants'
import {PROD_URL} from '@bluecentury/env'
import {LoadingIndicator} from '@bluecentury/components'

const Details = () => {
  const {isPlanningLoading, navigationLogDetails, getNavigationLogDetails} =
    usePlanning()
  const route = useRoute()
  const {navlog}: any = route.params
  useEffect(() => {
    getNavigationLogDetails(navlog.id)
  }, [])

  const renderDetails = () => {
    return (
      <Box
        borderWidth={1}
        borderColor={Colors.light}
        borderRadius={5}
        p={ms(20)}
        mt={ms(10)}
        bg={Colors.white}
        shadow={2}
      >
        <HStack alignItems="center">
          <Image alt="navglog-cargo-img" source={Icons.cargo} />
          <Text fontSize={ms(16)} fontWeight="medium" ml={ms(15)}>
            {formatLocationLabel(navigationLogDetails?.location)}
          </Text>
        </HStack>
        {!navigationLogDetails?.captainDatetimeETA &&
        !navigationLogDetails?.plannedETA ? null : (
          <DatetimePickerList
            title="ETA"
            date={navigationLogDetails?.captainDatetimeEta}
            locked={navigationLogDetails?.locked}
          />
        )}

        {!navigationLogDetails?.announcedDatetime &&
        !navigationLogDetails?.plannedETA ? null : (
          <DatetimePickerList
            title="NOR"
            date={navigationLogDetails?.announcedDatetime}
            locked={navigationLogDetails?.locked}
          />
        )}

        {!navigationLogDetails?.terminalApprovedDeparture &&
        !navigationLogDetails?.plannedETA ? null : (
          <DatetimePickerList
            title="DOC"
            date={navigationLogDetails?.terminalApprovedDeparture}
            locked={navigationLogDetails?.locked}
          />
        )}

        <Button
          bg={Colors.primary}
          leftIcon={<Icon as={Ionicons} name="save-outline" size="sm" />}
          mt={ms(20)}
        >
          Save Changes
        </Button>
      </Box>
    )
  }

  const CommentCard = ({comment, commentDescription}) => {
    return (
      <Box
        borderWidth={1}
        borderColor={Colors.light}
        borderRadius={5}
        p={ms(16)}
        mt={ms(10)}
        bg={Colors.white}
        shadow={2}
      >
        <HStack alignItems="center">
          <Avatar
            size="48px"
            source={{
              uri: comment?.user?.icon?.path
                ? `${PROD_URL}/upload/documents/${comment?.user?.icon?.path}`
                : ''
            }}
          />
          <Box ml={ms(10)}>
            <Text fontWeight="bold">
              {comment?.user ? comment?.user?.firstname : ''}{' '}
              {comment?.user ? comment?.user?.lastname : ''}
            </Text>
            <Text fontWeight="medium" color={Colors.disabled}>
              {moment(comment?.creationDate).format('DD MMM YYYY')}
            </Text>
          </Box>
        </HStack>
        <Text fontSize={ms(13)} mt={ms(5)}>
          {commentDescription}
        </Text>
      </Box>
    )
  }

  if (isPlanningLoading) return <LoadingIndicator />
  return (
    <Box flex="1">
      <ScrollView
        contentContainerStyle={{flexGrow: 1, paddingBottom: 20}}
        bg={Colors.white}
        px={ms(12)}
        py={ms(20)}
      >
        {/* Details Section */}
        <Text fontSize={ms(20)} fontWeight="bold" color={Colors.azure}>
          Details
        </Text>
        {renderDetails()}
        {/* Contact Information Section */}
        <Text
          fontSize={ms(20)}
          fontWeight="bold"
          color={Colors.azure}
          mt={ms(20)}
        >
          Contact Information
        </Text>
        <Box
          borderWidth={1}
          borderColor={Colors.light}
          borderRadius={5}
          p={ms(16)}
          mt={ms(10)}
          bg={Colors.white}
          shadow={2}
        >
          <Text>No contact information found.</Text>
        </Box>
        {/* Actions Section */}
        <Text
          fontSize={ms(20)}
          fontWeight="bold"
          color={Colors.azure}
          mt={ms(20)}
        >
          Actions
        </Text>
        <Box>
          <Button
            bg={Colors.primary}
            leftIcon={<Icon as={Ionicons} name="add" size="sm" />}
            mt={ms(20)}
          >
            Start new action
          </Button>
        </Box>
        {/* Comments Section */}
        <Text
          fontSize={ms(20)}
          fontWeight="bold"
          color={Colors.azure}
          mt={ms(20)}
        >
          Comments
        </Text>
        {navigationLogDetails?.comments?.map((comment, index) => {
          const filteredDescription = comment.description.replace(/(\\)/g, '')
          const descriptionText = filteredDescription.match(/([^<br>]+)/)[0]
          return (
            <CommentCard
              key={index}
              comment={comment}
              commentDescription={descriptionText}
            />
          )
        })}
      </ScrollView>
    </Box>
  )
}

export default Details
