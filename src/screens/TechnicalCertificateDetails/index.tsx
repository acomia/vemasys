import React from 'react'
import {TouchableOpacity} from 'react-native'
import {Box, Button, Divider, HStack, Icon, ScrollView, Text} from 'native-base'
import {NativeStackScreenProps} from '@react-navigation/native-stack'
import {ms} from 'react-native-size-matters'
import moment from 'moment'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import {useTranslation} from 'react-i18next'

import {Colors} from '@bluecentury/styles'
import {IconButton, NoInternetConnectionMessage} from '@bluecentury/components'
import {Icons} from '@bluecentury/assets'
import {VEMASYS_PRODUCTION_FILE_URL} from '@bluecentury/constants'
import {RootStackParamList} from '@bluecentury/types/nav.types'

type Props = NativeStackScreenProps<
  RootStackParamList,
  'TechnicalCertificateDetails'
>
const TechnicalCertificateDetails = ({navigation, route}: Props) => {
  const {t} = useTranslation()
  const {certificate} = route.params
  const isValid = certificate?.endDate ? certificate?.remainingDays >= 0 : true
  const isExpiring = certificate?.endDate
    ? certificate?.remainingDays <= 31
    : false

  const renderDocumentsSections = (file: any, index: number) => (
    <TouchableOpacity key={index}>
      <HStack
        alignItems="center"
        bg={Colors.white}
        borderRadius={5}
        height={ms(50)}
        justifyContent="space-between"
        mb={ms(15)}
        px={ms(16)}
        shadow={3}
        width="100%"
      >
        <Text
          ellipsizeMode="middle"
          flex="1"
          fontWeight="medium"
          maxW="80%"
          numberOfLines={1}
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
            size={ms(22)}
            source={Icons.eye}
            styles={{marginLeft: 15}}
            onPress={() =>
              navigation.navigate('PDFView', {
                path: `${VEMASYS_PRODUCTION_FILE_URL}/${file.path}`,
              })
            }
          />
        </HStack>
      </HStack>
    </TouchableOpacity>
  )

  return (
    <Box
      bg={Colors.white}
      borderTopLeftRadius={ms(15)}
      borderTopRightRadius={ms(15)}
      flex="1"
    >
      <NoInternetConnectionMessage />
      <ScrollView
        contentContainerStyle={{flexGrow: 1, paddingBottom: 30}}
        px={ms(12)}
        py={ms(20)}
      >
        <Box
          bg={Colors.white}
          borderColor={Colors.border}
          borderRadius={ms(5)}
          borderWidth={1}
          mt={ms(10)}
          shadow={2}
        >
          {/* Certificate Header */}
          <HStack
            alignItems="center"
            backgroundColor={Colors.border}
            px={ms(15)}
            py={ms(12)}
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
                  ? t('expired')
                  : `${t('expiresIn')}${certificate?.remainingDays} ${t(
                      'days'
                    )}`}
              </Text>
            </Box>

            {!isValid ? (
              <IconButton
                size={ms(25)}
                source={Icons.status_x}
                onPress={() => {}}
              />
            ) : isExpiring ? (
              <IconButton
                size={ms(25)}
                source={Icons.status_exclamation}
                onPress={() => {}}
              />
            ) : (
              <IconButton
                size={ms(25)}
                source={Icons.status_check}
                onPress={() => {}}
              />
            )}
          </HStack>
          {/* End of Header */}
          <Box p={ms(10)}>
            <Text color={Colors.disabled} fontWeight="medium">
              {t('validityPeriod')}
            </Text>
            <Text bold color={Colors.secondary}>
              {moment(certificate?.startDate).format('DD MMM YYYY')} -{' '}
              <Text bold color={Colors.danger}>
                {certificate?.endDate
                  ? moment(certificate?.endDate).format('DD MMM YYYY')
                  : t('never')}
              </Text>
            </Text>
          </Box>
          <Divider my={ms(5)} />
          <Box p={ms(10)}>
            <Text color={Colors.disabled} fontWeight="medium">
              {t('certificateType')}
            </Text>
            <Text bold color={Colors.text} fontSize={ms(16)}>
              {certificate?.type?.title}
            </Text>
          </Box>
          <Divider my={ms(5)} />
          <Box p={ms(10)}>
            <Text bold color={Colors.text} fontSize={ms(16)}>
              {t('description')}
            </Text>
            <Text color={Colors.text} fontSize={ms(13)}>
              {certificate?.description}
            </Text>
          </Box>
        </Box>
        <HStack alignItems="center" mt={ms(30)}>
          <Text bold color={Colors.azure} fontSize={ms(20)}>
            Documents
          </Text>
          {certificate?.fileGroup?.files?.length > 0 ? (
            <Text
              bold
              bg={Colors.azure}
              borderRadius={ms(20)}
              color={Colors.white}
              height={ms(22)}
              ml={ms(10)}
              textAlign="center"
              width={ms(22)}
            >
              {certificate?.fileGroup?.files?.length}
            </Text>
          ) : null}
        </HStack>
        <HStack justifyContent="space-between" mt={ms(10)}>
          <Text bold color={Colors.text} fontSize={ms(16)}>
            {t('file')}
          </Text>
          <Text bold color={Colors.text} fontSize={ms(16)}>
            {t('actions')}
          </Text>
        </HStack>
        <Divider mb={ms(10)} mt={ms(5)} />
        {certificate?.fileGroup?.files?.length > 0 ? (
          certificate?.fileGroup?.files?.map((file: any, index: number) =>
            renderDocumentsSections(file, index)
          )
        ) : (
          <Text color={Colors.text} fontWeight="medium" mb={ms(20)}>
            {t('noUploadedFiles')}
          </Text>
        )}
        <Button
          bg={Colors.primary}
          leftIcon={<Icon as={MaterialIcons} name="upload-file" size="md" />}
          mb={ms(20)}
          mt={ms(20)}
          onPress={() => {}}
        >
          {t('uploadDoc')}
        </Button>
      </ScrollView>
    </Box>
  )
}

export default TechnicalCertificateDetails
