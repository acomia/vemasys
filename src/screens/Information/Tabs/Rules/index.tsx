import React, {useEffect, useState} from 'react'
import {
  Box,
  Button,
  Divider,
  FlatList,
  HStack,
  Icon,
  Image,
  Input,
  ScrollView,
  Text,
} from 'native-base'
import {useEntity, useInformation} from '@bluecentury/stores'
import MaterialIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import {Colors} from '@bluecentury/styles'
import {ms} from 'react-native-size-matters'
import ReactNativeBlobUtil from 'react-native-blob-util'
import {Icons} from '@bluecentury/assets'
import {IconButton, LoadingAnimated} from '@bluecentury/components'
import {Shadow} from 'react-native-shadow-2'
import moment from 'moment'
import {VEMASYS_PRODUCTION_FILE_URL} from '@bluecentury/constants'
import {useNavigation} from '@react-navigation/native'

const Rules = () => {
  const navigation = useNavigation()
  const {isInformationLoading, rules, getVesselRules} = useInformation()
  const {vesselId} = useEntity()
  const [searchedValue, setSearchedValue] = useState('')
  const [rulesData, setRulesData] = useState([])

  useEffect(() => {
    getVesselRules(vesselId, '')
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
        borderWidth={1}
        borderColor={Colors.light}
        borderRadius={ms(5)}
        bg={Colors.white}
        shadow={1}
        mb={ms(4)}
        px={ms(10)}
        py={ms(8)}
      >
        <Box flex="1" mr={ms(10)}>
          <Text fontWeight="medium" color={Colors.text}>
            {item?.name}
          </Text>
          <Text color={Colors.disabled}>
            {moment(item?.startDate).format('DD MMM YYYY')}
          </Text>
        </Box>
        <HStack alignItems="center">
          <IconButton
            source={Icons.file_download}
            onPress={() => {}}
            size={ms(20)}
            styles={{marginRight: 20}}
          />
          <IconButton
            source={Icons.eye}
            onPress={() =>
              navigation.navigate('PDFView', {
                path: filePath,
              })
            }
            size={ms(20)}
          />
        </HStack>
      </HStack>
    )
  }

  const renderEmpty = () => (
    <Text
      fontSize={ms(15)}
      bold
      textAlign="center"
      color={Colors.text}
      mt={ms(10)}
    >
      No Rules.
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
      <Box flex="1" px={ms(12)} py={ms(15)} bg={Colors.white}>
        <Input
          w={{
            base: '100%',
          }}
          backgroundColor="#F7F7F7"
          InputLeftElement={
            <Icon
              as={<MaterialIcons name="magnify" />}
              size={5}
              ml="2"
              color={Colors.disabled}
            />
          }
          placeholderTextColor={Colors.disabled}
          fontWeight="medium"
          placeholder="Search for rules..."
          variant="filled"
          size="sm"
          value={searchedValue}
          onChangeText={e => onSearchPegel(e)}
        />
        <HStack mt={ms(20)} alignItems="center" px={ms(10)}>
          <Text flex="1" fontSize={ms(16)} bold color={Colors.text}>
            Details
          </Text>
          <Text fontSize={ms(16)} bold color={Colors.text}>
            Actions
          </Text>
        </HStack>
        <Divider mt={ms(5)} mb={ms(15)} />
        {rules?.length > 0 ? (
          <FlatList
            data={rulesData}
            renderItem={renderRules}
            contentContainerStyle={{paddingBottom: 20}}
            keyExtractor={(item: any) => `Rule-${item.id}`}
            ListEmptyComponent={renderEmpty}
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
