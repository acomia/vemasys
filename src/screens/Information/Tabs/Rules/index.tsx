import React, {useEffect, useState} from 'react'
import {Box, Divider, FlatList, HStack, Icon, Input, Text} from 'native-base'
import MaterialIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import {ms} from 'react-native-size-matters'
import ReactNativeBlobUtil from 'react-native-blob-util'
import {useNavigation} from '@react-navigation/native'
import {useTranslation} from 'react-i18next'
import moment from 'moment'

import {Colors} from '@bluecentury/styles'
import {Icons} from '@bluecentury/assets'
import {IconButton, LoadingAnimated} from '@bluecentury/components'
import {VEMASYS_PRODUCTION_FILE_URL} from '@bluecentury/constants'
import {useEntity, useInformation} from '@bluecentury/stores'

const Rules = () => {
  const {t} = useTranslation()
  const navigation = useNavigation()
  const {rules, getVesselRules} = useInformation()
  const {vesselId} = useEntity()
  const [searchedValue, setSearchedValue] = useState('')
  const [rulesData, setRulesData] = useState([])

  useEffect(() => {
    getVesselRules(vesselId, '')
    /* eslint-disable react-hooks/exhaustive-deps */
    /* eslint-disable react-native/no-inline-styles */
  }, [vesselId])

  useEffect(() => {
    setRulesData(rules)
  }, [rules])

  const renderRules = ({item, index}: any) => {
    let filePath = ''
    if (item.fileGroup.files.length > 0) {
      filePath = item.fileGroup.files[0].path.startsWith(
        ReactNativeBlobUtil.fs.dirs.DocumentDir
      )
        ? item.fileGroup.files[0].path
        : `${VEMASYS_PRODUCTION_FILE_URL}/${item.fileGroup.files[0].path}`
    }
    return (
      <HStack
        key={`Rules-${index}`}
        alignItems="center"
        bg={Colors.white}
        borderColor={Colors.light}
        borderRadius={ms(5)}
        borderWidth={1}
        mb={ms(4)}
        px={ms(10)}
        py={ms(8)}
        shadow={1}
      >
        <Box flex="1" mr={ms(10)}>
          <Text color={Colors.text} fontWeight="medium">
            {item?.name}
          </Text>
          <Text color={Colors.disabled}>
            {moment(item?.startDate).format('DD MMM YYYY')}
          </Text>
        </Box>
        <HStack alignItems="center">
          <IconButton
            size={ms(20)}
            source={Icons.file_download}
            styles={{marginRight: 20}}
            onPress={() => {}}
          />
          <IconButton
            size={ms(20)}
            source={Icons.eye}
            onPress={() =>
              navigation.navigate('PDFView', {
                path: filePath,
              })
            }
          />
        </HStack>
      </HStack>
    )
  }

  const renderEmpty = () => (
    <Text
      bold
      color={Colors.text}
      fontSize={ms(15)}
      mt={ms(10)}
      textAlign="center"
    >
      {t('noRules')}
    </Text>
  )

  const onSearchPegel = (val: string) => {
    setSearchedValue(val)
    const searched = rules?.filter(rule => {
      const containsKey = val
        ? `${rule?.name?.toLowerCase()}`?.includes(val?.toLowerCase())
        : true

      return containsKey
    })
    setRulesData(searched)
  }

  return (
    <Box flex="1">
      <Box bg={Colors.white} flex="1" px={ms(12)} py={ms(15)}>
        <Input
          InputLeftElement={
            <Icon
              as={<MaterialIcons name="magnify" />}
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
          placeholder="Search for rules..."
          placeholderTextColor={Colors.disabled}
          size="sm"
          value={searchedValue}
          variant="filled"
          onChangeText={e => onSearchPegel(e)}
        />
        <HStack alignItems="center" mt={ms(20)} px={ms(10)}>
          <Text bold color={Colors.text} flex="1" fontSize={ms(16)}>
            {t('details')}
          </Text>
          <Text bold color={Colors.text} fontSize={ms(16)}>
            {t('actions')}
          </Text>
        </HStack>
        <Divider mb={ms(15)} mt={ms(5)} />
        {rules?.length > 0 ? (
          <FlatList
            ListEmptyComponent={renderEmpty}
            contentContainerStyle={{paddingBottom: 20}}
            data={rulesData}
            keyExtractor={(item: any) => `Rule-${item.id}`}
            renderItem={renderRules}
            showsVerticalScrollIndicator={false}
          />
        ) : (
          <LoadingAnimated />
        )}
      </Box>
      {/* <Box bg={Colors.white}>
        <Shadow
          viewStyle={{
            width: '100%'
          }}
        >
          <Button
            leftIcon={
              <Icon
                as={MaterialIcons}
                name="folder-download-outline"
                size="md"
              />
            }
            my={ms(15)}
            mx={ms(12)}
            bg={Colors.primary}
          >
            Download all
          </Button>
        </Shadow>
      </Box> */}
    </Box>
  )
}

export default Rules
