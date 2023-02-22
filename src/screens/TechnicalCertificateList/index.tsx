import React, {useState} from 'react'
import {TouchableOpacity} from 'react-native'
import {
  Box,
  Button,
  Divider,
  FlatList,
  HStack,
  Icon,
  Input,
  Text,
} from 'native-base'
import moment from 'moment'
import {Shadow} from 'react-native-shadow-2'
import Material from 'react-native-vector-icons/MaterialCommunityIcons'
import {ms} from 'react-native-size-matters'
import {useTranslation} from 'react-i18next'

import {Colors} from '@bluecentury/styles'
import {IconButton, NoInternetConnectionMessage} from '@bluecentury/components'
import {Icons} from '@bluecentury/assets'
import {NativeStackScreenProps} from '@react-navigation/native-stack'
type Props = NativeStackScreenProps<RootStackParamList>
const TechnicalCertificareList = ({navigation, route}: Props) => {
  const {t} = useTranslation()
  const {certificates, title} = route.params
  const [searchedValue, setSearchValue] = useState('')
  const [certData, setCertData] = useState(certificates)

  const onSearchCertificate = (value: string) => {
    setSearchValue(value)
    const searchedCharter = certificates?.filter(certificate => {
      const containsKey = value
        ? `${certificate?.name?.toLowerCase()}`?.includes(value?.toLowerCase())
        : true

      return containsKey
    })

    setCertData(searchedCharter)
  }

  const renderItem = ({item, index}: any) => {
    const isValid = item?.endDate ? item?.remainingDays >= 0 : true
    const isExpiring = item?.endDate ? item?.remainingDays <= 31 : false
    const canBeDownload = item?.fileGroup?.files?.length > 0
    return (
      <TouchableOpacity
        key={index}
        activeOpacity={0.6}
        onPress={() =>
          navigation.navigate('TechnicalCertificateDetails', {
            certificate: item,
          })
        }
      >
        <Box
          bg={Colors.white}
          borderColor={Colors.border}
          borderRadius={ms(5)}
          borderWidth={1}
          mt={ms(10)}
          shadow={1}
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
                {item?.name}
              </Text>
              <Text
                color={
                  item?.remainingDays < 0 ? Colors.danger : Colors.secondary
                }
              >
                {item?.remainingDays === 0
                  ? '---'
                  : item?.remainingDays < 0
                  ? t('expired')
                  : `${t('expiresIn')} ${item?.remainingDays} ${t('days')}`}
              </Text>
            </Box>

            <IconButton
              size={ms(25)}
              source={Icons.cloud_download}
              tintColor={canBeDownload ? '' : '#8FB4C9'}
              onPress={() => {}}
            />
          </HStack>
          {/* End of Header */}
          <HStack p={ms(15)}>
            <Box flex="1">
              <Text color={Colors.disabled} fontWeight="medium">
                {t('validityPeriod')}
              </Text>
              <Text bold color={Colors.secondary}>
                {moment(item?.startDate).format('DD MMM YYYY')} -{' '}
                <Text bold color={Colors.danger}>
                  {item?.endDate
                    ? moment(item?.endDate).format('DD MMM YYYY')
                    : t('never')}
                </Text>
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
        </Box>
      </TouchableOpacity>
    )
  }

  const renderHeader = () => (
    <Box>
      <Input
        InputLeftElement={
          <Icon
            as={<Material name="magnify" />}
            color={Colors.disabled}
            ml="2"
            size={5}
          />
        }
        w={{
          base: '100%',
        }}
        backgroundColor={Colors.light_grey}
        fontWeight="medium"
        mb={ms(10)}
        placeholder={t('searchCertificate')}
        placeholderTextColor={Colors.disabled}
        size="sm"
        value={searchedValue}
        variant="filled"
        onChangeText={e => onSearchCertificate(e)}
      />

      <Text bold color={Colors.azure} fontSize={ms(20)}>
        {t('certificates')}
      </Text>
      <Divider my={ms(10)} />
    </Box>
  )

  return (
    <Box flex="1">
      <NoInternetConnectionMessage />
      <Box bg={Colors.white} flex="1" px={ms(12)} py={ms(20)}>
        {renderHeader()}

        <FlatList
          ListEmptyComponent={() => (
            <Text
              bold
              color={Colors.azure}
              fontSize={ms(20)}
              mt={ms(20)}
              textAlign="center"
            >
              {t('noCertificates')}
            </Text>
          )}
          data={
            searchedValue !== ''
              ? certData
              : certificates?.sort((a: any, b: any) =>
                  b.endDate || b.endDate === null
                    ? a.remainingDays > b.remainingDays
                      ? 1
                      : a.remainingDays < b.remainingDays
                      ? -1
                      : 0
                    : -1
                )
          }
          contentContainerStyle={{paddingBottom: 10}}
          keyExtractor={item => `Certificate-${item.id}`}
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
        />
      </Box>
      <Box bg={Colors.white}>
        <Shadow
          viewStyle={{
            width: '100%',
          }}
        >
          <Button
            leftIcon={
              <Icon as={Material} name="folder-download-outline" size="md" />
            }
            bg={Colors.primary}
            mx={ms(12)}
            my={ms(15)}
          >
            {t('downloadAll')}
          </Button>
        </Shadow>
      </Box>
    </Box>
  )
}

export default TechnicalCertificareList
