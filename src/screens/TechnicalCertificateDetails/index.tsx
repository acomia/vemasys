import React from 'react'
import {TouchableOpacity} from 'react-native'
import {Box, Button, Divider, HStack, Icon, ScrollView, Text} from 'native-base'
import {NativeStackScreenProps} from '@react-navigation/native-stack'
import {ms} from 'react-native-size-matters'
import moment from 'moment'

import {Colors} from '@bluecentury/styles'
import {IconButton} from '@bluecentury/components'
import {Icons} from '@bluecentury/assets'
import {VEMASYS_PRODUCTION_FILE_URL} from '@bluecentury/constants'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'

type Props = NativeStackScreenProps<RootStackParamList>
const TechnicalCertificateDetails = ({navigation, route}: Props) => {
  const {certificate} = route.params
  const isValid = certificate?.endDate ? certificate?.remainingDays >= 0 : true
  const isExpiring = certificate?.endDate
    ? certificate?.remainingDays <= 31
    : false

  const renderDocumentsSections = (file: any, index: number) => (
    <TouchableOpacity key={index}>
      <HStack
        bg={Colors.white}
        borderRadius={5}
        justifyContent="space-between"
        alignItems="center"
        height={ms(50)}
        px={ms(16)}
        width="100%"
        mb={ms(15)}
        shadow={3}
      >
        <Text
          flex="1"
          maxW="80%"
          fontWeight="medium"
          numberOfLines={1}
          ellipsizeMode="middle"
        >
          {file.path}
        </Text>
        <HStack alignItems="center">
          {/* <IconButton
            source={Icons.file_download}
            onPress={() => {}}
            size={ms(22)}
          /> */}
          <IconButton
            source={Icons.eye}
            onPress={() =>
              navigation.navigate('PDFView', {
                path: `${VEMASYS_PRODUCTION_FILE_URL}/${file.path}`,
              })
            }
            size={ms(22)}
            styles={{marginLeft: 15}}
          />
        </HStack>
      </HStack>
    </TouchableOpacity>
  )

  return (
    <Box
      flex="1"
      bg={Colors.white}
      borderTopLeftRadius={ms(15)}
      borderTopRightRadius={ms(15)}
    >
      <ScrollView
        contentContainerStyle={{flexGrow: 1, paddingBottom: 30}}
        px={ms(12)}
        py={ms(20)}
      >
        <Box
          borderRadius={ms(5)}
          borderWidth={1}
          borderColor={Colors.border}
          mt={ms(10)}
          bg={Colors.white}
          shadow={2}
        >
          {/* Certificate Header */}
          <HStack
            backgroundColor={Colors.border}
            px={ms(15)}
            py={ms(12)}
            alignItems="center"
          >
            <Box flex="1">
              <Text color={Colors.text} fontWeight="medium">
                {certificate?.name}
              </Text>
              <Text
                color={
                  certificate?.remainingDays < 0
                    ? Colors.danger
                    : Colors.secondary
                }
              >
                {certificate?.remainingDays === 0
                  ? '---'
                  : certificate?.remainingDays < 0
                  ? 'Expired'
                  : `Expires in ${certificate?.remainingDays} days`}
              </Text>
            </Box>

            {!isValid ? (
              <IconButton
                source={Icons.status_x}
                onPress={() => {}}
                size={ms(25)}
              />
            ) : isExpiring ? (
              <IconButton
                source={Icons.status_exclamation}
                onPress={() => {}}
                size={ms(25)}
              />
            ) : (
              <IconButton
                source={Icons.status_check}
                onPress={() => {}}
                size={ms(25)}
              />
            )}
          </HStack>
          {/* End of Header */}
          <Box p={ms(10)}>
            <Text color={Colors.disabled} fontWeight="medium">
              Validity Period
            </Text>
            <Text color={Colors.secondary} fontWeight="bold">
              {moment(certificate?.startDate).format('DD MMM YYYY')} -{' '}
              <Text color={Colors.danger} fontWeight="bold">
                {certificate?.endDate
                  ? moment(certificate?.endDate).format('DD MMM YYYY')
                  : 'Never'}
              </Text>
            </Text>
          </Box>
          <Divider my={ms(5)} />
          <Box p={ms(10)}>
            <Text color={Colors.disabled} fontWeight="medium">
              Certificate type
            </Text>
            <Text color={Colors.text} fontSize={ms(16)} fontWeight="bold">
              {certificate?.type?.title}
            </Text>
          </Box>
          <Divider my={ms(5)} />
          <Box p={ms(10)}>
            <Text color={Colors.text} fontSize={ms(16)} fontWeight="bold">
              Description
            </Text>
            <Text color={Colors.text} fontSize={ms(13)}>
              {certificate?.description}
            </Text>
          </Box>
        </Box>
        <HStack alignItems="center" mt={ms(30)}>
          <Text fontSize={ms(20)} fontWeight="bold" color={Colors.azure}>
            Documents
          </Text>
          {certificate?.fileGroup?.files?.length > 0 ? (
            <Text
              bg={Colors.azure}
              color={Colors.white}
              width={ms(22)}
              height={ms(22)}
              ml={ms(10)}
              borderRadius={ms(20)}
              fontWeight="bold"
              textAlign="center"
            >
              {certificate?.fileGroup?.files?.length}
            </Text>
          ) : null}
        </HStack>
        <HStack mt={ms(10)} justifyContent="space-between">
          <Text fontSize={ms(16)} fontWeight="bold" color={Colors.text}>
            File
          </Text>
          <Text fontSize={ms(16)} fontWeight="bold" color={Colors.text}>
            Actions
          </Text>
        </HStack>
        <Divider mb={ms(10)} mt={ms(5)} />
        {certificate?.fileGroup?.files?.length > 0 ? (
          certificate?.fileGroup?.files?.map((file: any, index: number) =>
            renderDocumentsSections(file, index)
          )
        ) : (
          <Text mb={ms(20)} color={Colors.text} fontWeight="medium">
            No uploaded files.
          </Text>
        )}
        <Button
          bg={Colors.primary}
          leftIcon={<Icon as={MaterialIcons} name="upload-file" size="md" />}
          mt={ms(20)}
          mb={ms(20)}
          onPress={() => {}}
        >
          Upload Document
        </Button>
      </ScrollView>
    </Box>
  )
}

export default TechnicalCertificateDetails
