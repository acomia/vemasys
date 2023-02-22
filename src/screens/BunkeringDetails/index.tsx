import React from 'react'
import {Box, Button, Divider, HStack, Icon, Spacer, Text} from 'native-base'
import {ms} from 'react-native-size-matters'
import {NativeStackScreenProps} from '@react-navigation/native-stack'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'

import {Colors} from '@bluecentury/styles'
import moment from 'moment'
import {formatNumber, VEMASYS_PRODUCTION_FILE_URL} from '@bluecentury/constants'
import {IconButton} from '@bluecentury/components'
import {Icons} from '@bluecentury/assets'
import {TouchableOpacity} from 'react-native'
import {useTranslation} from 'react-i18next'

type Props = NativeStackScreenProps<RootStackParamList>
export default function BunkeringDetails({route, navigation}: Props) {
  const {t} = useTranslation()
  const {bunk}: any = route.params

  const renderCardDetails = (title: string, value: string, suffix?: string) => {
    return (
      <HStack
        bg={Colors.white}
        borderRadius={5}
        justifyContent="space-between"
        alignItems="center"
        height={ms(50)}
        px={ms(15)}
        width="100%"
        mb={ms(10)}
        shadow={3}
      >
        <Text flex="1" fontWeight="medium">
          {title}
        </Text>
        <Box
          flex="1"
          borderLeftWidth={ms(1)}
          borderColor={Colors.light}
          height="100%"
          justifyContent="center"
        >
          <Text fontWeight="medium" color={Colors.azure} ml={ms(13)}>
            {value} {suffix}
          </Text>
        </Box>
      </HStack>
    )
  }
  return (
    <Box flex="1" bg={Colors.white}>
      <Box px={ms(12)} py={ms(20)}>
        <Text fontSize={ms(20)} bold color={Colors.azure}>
          {t('details')}
        </Text>
        <Divider my={ms(15)} />
        {renderCardDetails('Name', bunk.entity.name)}
        {renderCardDetails('Date', moment(bunk.date).format('DD MMM YYYY'))}
        {renderCardDetails(
          'Bunkered quantity',
          formatNumber(bunk.value, 2, ' '),
          'L'
        )}
        <Text fontSize={ms(20)} bold color={Colors.azure} mt={ms(15)}>
          {t('documents')}
        </Text>
        <HStack mt={ms(10)} justifyContent="space-between">
          <Text fontSize={ms(16)} bold color={Colors.text}>
            {t('file')}
          </Text>
          <Text fontSize={ms(16)} bold color={Colors.text}>
            {t('actions')}
          </Text>
        </HStack>
        <Divider my={ms(15)} />
        {bunk?.fileGroup?.files?.length > 0 ? (
          bunk?.fileGroup?.files?.map((file: any, index: number) => (
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
                  <IconButton
                    source={Icons.file_download}
                    onPress={() => {}}
                    size={ms(22)}
                  />
                  <Box w={ms(10)} />
                  <IconButton
                    source={Icons.eye}
                    onPress={() =>
                      navigation.navigate('PDFView', {
                        path: `${VEMASYS_PRODUCTION_FILE_URL}/${file.path}`,
                      })
                    }
                    size={ms(22)}
                  />
                </HStack>
              </HStack>
            </TouchableOpacity>
          ))
        ) : (
          <Text mb={ms(20)} color={Colors.text} fontWeight="medium">
            {t('noUploadedFiles')}
          </Text>
        )}
        <Button
          bg={Colors.primary}
          leftIcon={<Icon as={MaterialIcons} name="upload-file" size="sm" />}
        >
          {t('uploadDocs')}
        </Button>
      </Box>
    </Box>
  )
}
