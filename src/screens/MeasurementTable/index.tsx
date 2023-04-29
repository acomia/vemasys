import React, {useEffect, useState} from 'react'
import {
  Box,
  Text,
  Divider,
  FormControl,
  Input,
  HStack,
  VStack,
  ScrollView,
  Button,
} from 'native-base'
import {RootStackParamList} from '@bluecentury/types/nav.types'
import {ms} from 'react-native-size-matters'
import {TouchableOpacity} from 'react-native'
import Ionicons from 'react-native-vector-icons/Ionicons'
import {Colors} from '@bluecentury/styles'
import {NavigationProp, useNavigation} from '@react-navigation/native'
import {useTranslation} from 'react-i18next'
import {useSettings} from '@bluecentury/stores'

//TODO we need to add backend functionality. Steps:
// 1) Check if we have existing table /api/tonnage_certifications?exploitationVessel.id={{uat_blue_c_exploitation_vessel_id}}
// 2) If exists response will return an array of first and last table rows and data changed by user (first and last response elements)
// 3) We should use calculateTable function with values of first and last table rows
// 4) For each response element except first and last we should extract tonnage and draught and set them to changedData
// 5) We should run recalculateTable(changedData, dataForTable)
// 6) On save we need to add functionality to save tableData
// 7) Step 1 - remove previous tonnage certification https://app-uat.vemasys.eu/api/tonnage_certifications/{certification_id}
// 8) Step 2 - create an array of data to upload dataToUpload = [...changedData]
// 9) Step 3 - look for dataForTable[0] in dataToUpload if there's no add it dataToUpload = [dataForTable[0], ...dataToUpload]
// 10) Step 4 - look for dataForTable[last] in dataToUpload if there's no add it dataToUpload = [...dataToUpload, dataForTable[last]
// 11) Step 5 - upload each dataToUpload element separately post https://app-uat.vemasys.eu/api/tonnage_certifications
// {
//     exploitationVessel: probably exploitation vessel id,
//     vesselCategory: {
//         title: don't know what should be here,
//         length: don't know what should be here
//     },
//     tonnage: dataToUpload.tonnage,
//     draught: dataToUpload.draught
// }

type TableItem = {
  draught: number
  tonnage: number
}

const MeasurementTable = () => {
  const {t} = useTranslation()
  const navigation = useNavigation<NavigationProp<RootStackParamList>>()
  const {setDraughtTable} = useSettings()

  const [draughtCmMin, setDraughtCmMin] = useState<number | null>(null)
  const [draughtCmMax, setDraughtCmMax] = useState<number | null>(null)
  const [tonnageTMin, setTonnageTMin] = useState<number | null>(null)
  const [tonnageTMax, setTonnageTMax] = useState<number | null>(null)
  const [dataForTable, setDataForTable] = useState<TableItem[]>([])
  const [changedData, setChangedData] = useState<TableItem[]>([])

  useEffect(() => {
    navigation.setOptions({
      headerLeft: () => {
        return (
          <Box ml={ms(1)} mr={ms(20)}>
            <TouchableOpacity
              onPress={() => {
                navigation.goBack()
              }}
            >
              <Ionicons
                color={Colors.black}
                name="arrow-back-outline"
                size={ms(25)}
              />
            </TouchableOpacity>
          </Box>
        )
      },
    })
  }, [navigation])

  useEffect(() => {
    if (
      draughtCmMin !== null &&
      draughtCmMax !== null &&
      tonnageTMin !== null &&
      tonnageTMax !== null
    ) {
      setDataForTable(
        calculateTable(tonnageTMax, tonnageTMin, draughtCmMax, draughtCmMin)
      )
    }
    setChangedData([])
  }, [draughtCmMin, draughtCmMax, tonnageTMin, tonnageTMax])

  const addUserChangedData = (item: TableItem) => {
    const existingItemIndex = changedData.findIndex(
      changedDataItem => changedDataItem.draught === item.draught
    )
    let updatedArray = [...changedData]

    if (existingItemIndex !== -1) {
      updatedArray[existingItemIndex] = item
    } else {
      updatedArray = [...updatedArray, item]
    }
    const sortedArray = updatedArray.sort((a, b) => a.draught - b.draught)
    setChangedData(sortedArray)
    recalculateTable(sortedArray, dataForTable)
  }

  const calculateTable = (
    tonnageMax: number,
    tonnageMin: number,
    draughtMax: number,
    draughtMin: number
  ): TableItem[] => {
    const tonnageToOneCmDraught =
      (tonnageMax - tonnageMin) / (draughtMax - draughtMin)
    const draughtDifference = draughtMax - draughtMin
    const cmArray = Array.from(
      Array(draughtDifference + 1),
      (x, i) => i + draughtMin
    )
    const tableData = (
      tonnageDraught: number,
      draughts: number[]
    ): TableItem[] => {
      return draughts.map((item, index) => ({
        draught: item,
        tonnage: tonnageMin + tonnageDraught * index,
      }))
    }
    return tableData(tonnageToOneCmDraught, cmArray)
  }

  const recalculateTable = (
    changedDraughtArray: TableItem[],
    dataArray: TableItem[]
  ) => {
    changedDraughtArray.map((changedDraughtArrayItem, index) => {
      const dataArrayStartIndex = dataArray.findIndex(
        item => changedDraughtArrayItem.draught === item.draught
      )

      if (index === changedDraughtArray.length - 1) {
        const arrayToProceed = dataArray.slice(
          dataArrayStartIndex,
          dataArray.length
        )
        const recalculatedArray = calculateTable(
          dataArray[dataArray.length - 1].tonnage,
          changedDraughtArrayItem.tonnage,
          dataArray[dataArray.length - 1].draught,
          changedDraughtArrayItem.draught
        )
        dataArray.splice(
          dataArrayStartIndex,
          arrayToProceed.length,
          ...recalculatedArray
        )
        setDataForTable(dataArray)
      } else {
        const dataArrayLastIndex = dataArray.findIndex(
          item => changedDraughtArray[index + 1].draught === item.draught
        )
        const arrayToProceed = dataArray.slice(
          dataArrayStartIndex,
          dataArrayLastIndex + 1
        )
        const recalculatedArray = calculateTable(
          changedDraughtArray[index + 1].tonnage,
          changedDraughtArrayItem.tonnage,
          changedDraughtArray[index + 1].draught,
          changedDraughtArrayItem.draught
        )
        dataArray.splice(
          dataArrayStartIndex,
          arrayToProceed.length,
          ...recalculatedArray
        )
        setDataForTable(dataArray)
      }
    })
  }

  return (
    <Box backgroundColor={Colors.white} flex={1} pt={ms(38)} px={ms(16)}>
      <Text bold color={Colors.azure} fontSize={ms(20)}>
        {t('tonnageCertification')}
      </Text>
      <Divider mb={ms(20)} mt={ms(10)} />
      <HStack justifyContent="space-between">
        <FormControl w="40%">
          <Text color={Colors.disabled} fontSize={ms(14)} mb={ms(8)}>
            {t('draughtCmMin')}
          </Text>
          <Input
            backgroundColor={Colors.light_grey}
            borderWidth="0"
            color={Colors.text}
            fontSize={ms(14)}
            h={ms(40)}
            keyboardType="number-pad"
            placeholder={t('enterNumber') as string}
            onChangeText={val => setDraughtCmMin(Number(val))}
          />
        </FormControl>
        <FormControl w="40%">
          <Text color={Colors.disabled} fontSize={ms(14)} mb={ms(8)}>
            {t('draughtCmMax')}
          </Text>
          <Input
            backgroundColor={Colors.light_grey}
            borderWidth="0"
            color={Colors.text}
            fontSize={ms(14)}
            h={ms(40)}
            keyboardType="number-pad"
            placeholder={t('enterNumber') as string}
            onChangeText={val => setDraughtCmMax(Number(val))}
          />
        </FormControl>
      </HStack>
      <Divider mb={ms(20)} mt={ms(10)} />
      <HStack justifyContent="space-between">
        <FormControl w="40%">
          <Text color={Colors.disabled} fontSize={ms(14)} mb={ms(8)}>
            {t('tonnageTMin')}
          </Text>
          <Input
            backgroundColor={Colors.light_grey}
            borderWidth="0"
            color={Colors.text}
            fontSize={ms(14)}
            h={ms(40)}
            keyboardType="number-pad"
            placeholder={t('enterNumber') as string}
            onChangeText={val => setTonnageTMin(Number(val))}
          />
        </FormControl>
        <FormControl w="40%">
          <Text color={Colors.disabled} fontSize={ms(14)} mb={ms(8)}>
            {t('tonnageTMax')}
          </Text>
          <Input
            backgroundColor={Colors.light_grey}
            borderWidth="0"
            color={Colors.text}
            fontSize={ms(14)}
            h={ms(40)}
            keyboardType="number-pad"
            placeholder={t('enterNumber') as string}
            onChangeText={val => setTonnageTMax(Number(val))}
          />
        </FormControl>
      </HStack>
      <Divider mb={ms(20)} mt={ms(10)} />
      {dataForTable.length ? (
        <Box flex={1}>
          <HStack>
            <Text color={Colors.text} fontSize={ms(14)} mb={ms(8)} w="50%">
              Draught (cm)
            </Text>
            <Text color={Colors.text} fontSize={ms(14)} mb={ms(8)} w="50%">
              Tonnage (T)
            </Text>
          </HStack>
          <ScrollView flex={1}>
            {dataForTable.map((item, index) => (
              <HStack justifyContent="space-between">
                <VStack w="45%">
                  <Input
                    backgroundColor={Colors.light_grey}
                    borderWidth="0"
                    color={Colors.text}
                    fontSize={ms(14)}
                    h={ms(40)}
                    isDisabled={true}
                    keyboardType="number-pad"
                    mb={ms(12)}
                    value={item.draught.toString()}
                  />
                </VStack>
                <VStack w="50%">
                  <Input
                    isDisabled={
                      index === 0 || index === dataForTable.length - 1
                    }
                    backgroundColor={Colors.light_grey}
                    borderWidth="0"
                    color={Colors.text}
                    defaultValue={item.tonnage.toString()}
                    fontSize={ms(14)}
                    h={ms(40)}
                    keyboardType="number-pad"
                    mb={ms(12)}
                    onChangeText={val => {
                      if (val) {
                        addUserChangedData({
                          draught: item.draught,
                          tonnage: parseFloat(val),
                        })
                      }
                    }}
                  />
                </VStack>
              </HStack>
            ))}
          </ScrollView>
          <HStack
            justifyContent="space-between"
            pb={ms(48)}
            pt={ms(12)}
            px={ms(12)}
          >
            <Button
              bg={Colors.white}
              maxH={ms(40)}
              w="45%"
              onPress={() => {
                setDraughtCmMin(null)
                setDraughtCmMax(null)
                setTonnageTMin(null)
                setTonnageTMax(null)
                setDataForTable([])
                setChangedData([])
                navigation.goBack()
              }}
            >
              <Text bold color={Colors.disabled} fontSize={ms(16)}>
                {t('cancel')}
              </Text>
            </Button>
            <Button
              bg={Colors.primary}
              maxH={ms(40)}
              w="45%"
              onPress={() => {
                setDraughtTable(dataForTable)
              }}
            >
              <Text bold color={Colors.white} fontSize={ms(16)}>
                {t('save')}
              </Text>
            </Button>
          </HStack>
        </Box>
      ) : null}
    </Box>
  )
}

export default MeasurementTable
