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
  ScrollView,
  Text
} from 'native-base'
import moment from 'moment'
import {Shadow} from 'react-native-shadow-2'
import Material from 'react-native-vector-icons/MaterialCommunityIcons'
import {ms} from 'react-native-size-matters'

import {Colors} from '@bluecentury/styles'
import {IconButton, LoadingIndicator} from '@bluecentury/components'
import {Icons} from '@bluecentury/assets'
import {SharedElement} from 'react-navigation-shared-element'
import {NativeStackScreenProps} from '@react-navigation/native-stack'

type Props = NativeStackScreenProps<RootStackParamList>
const TechnicalCertificareList = ({navigation, route}: Props) => {
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
    const hasBeenDownloaded = item?.downloaded
    return (
      <TouchableOpacity
        key={index}
        activeOpacity={0.6}
        onPress={() =>
          navigation.navigate('TechnicalCertificateDetails', {
            certificate: item
          })
        }
      >
        <Box
          borderRadius={ms(5)}
          borderWidth={1}
          borderColor={Colors.border}
          mt={ms(10)}
          bg={Colors.white}
          shadow={1}
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
                  ? 'Expired'
                  : `Expires in ${item?.remainingDays} days`}
              </Text>
            </Box>

            <IconButton
              source={Icons.cloud_download}
              onPress={() => {}}
              size={ms(25)}
              tintColor={hasBeenDownloaded ? '#8FB4C9' : ''}
            />
          </HStack>
          {/* End of Header */}
          <HStack p={ms(15)}>
            <Box flex="1">
              <Text color={Colors.disabled} fontWeight="medium">
                Validity Period
              </Text>
              <Text color={Colors.secondary} fontWeight="bold">
                {moment(item?.startDate).format('DD MMM YYYY')} -{' '}
                <Text color={Colors.danger} fontWeight="bold">
                  {item?.endDate
                    ? moment(item?.endDate).format('DD MMM YYYY')
                    : 'Never'}
                </Text>
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
        </Box>
      </TouchableOpacity>
    )
  }

  const renderHeader = () => (
    <Box>
      <Input
        w={{
          base: '100%'
        }}
        backgroundColor="#F7F7F7"
        InputLeftElement={
          <Icon
            as={<Material name="magnify" />}
            size={5}
            ml="2"
            color={Colors.disabled}
          />
        }
        placeholderTextColor={Colors.disabled}
        fontWeight="medium"
        placeholder="Search certificate"
        variant="filled"
        size="sm"
        mb={ms(10)}
        value={searchedValue}
        onChangeText={e => onSearchCertificate(e)}
      />

      <Text fontSize={ms(20)} fontWeight="bold" color={Colors.azure}>
        Certificates
      </Text>
      <Divider my={ms(10)} />
    </Box>
  )

  return (
    <Box flex="1">
      <Box flex="1" px={ms(12)} py={ms(20)} bg={Colors.white}>
        {renderHeader()}

        <FlatList
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
          renderItem={renderItem}
          keyExtractor={item => `Certificate-${item.id}`}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{paddingBottom: 10}}
          ListEmptyComponent={() => (
            <Text
              fontSize={ms(20)}
              fontWeight="bold"
              color={Colors.azure}
              mt={ms(20)}
              textAlign="center"
            >
              No Certificates.
            </Text>
          )}
        />
      </Box>
      <Box bg={Colors.white}>
        <Shadow
          viewStyle={{
            width: '100%'
          }}
        >
          <Button
            bg={Colors.primary}
            leftIcon={
              <Icon as={Material} name="folder-download-outline" size="md" />
            }
            my={ms(15)}
            mx={ms(12)}
          >
            Download all
          </Button>
        </Shadow>
      </Box>
    </Box>
  )
}

export default TechnicalCertificareList
