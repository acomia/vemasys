import React, {useEffect, useState} from 'react'
import {
  Box,
  Text,
  Divider,
  FormControl,
  Input,
  HStack,
  Button,
} from 'native-base'
import {RootStackParamList} from '@bluecentury/types/nav.types'
import {ms} from 'react-native-size-matters'
import {TouchableOpacity} from 'react-native'
import Ionicons from 'react-native-vector-icons/Ionicons'
import {Colors} from '@bluecentury/styles'
import {NavigationProp, useNavigation} from '@react-navigation/native'
import {useTranslation} from 'react-i18next'
import {useEntity, useSettings} from '@bluecentury/stores'
import {calculateTable, recalculateTable} from '@bluecentury/utils'
import {OTPInput, LoadingAnimated} from '@bluecentury/components'
import {FlashList} from '@shopify/flash-list'

type TableItem = {
  draught: number
  tonnage: number
}

const MeasurementTable = () => {
  const {t} = useTranslation()
  const navigation = useNavigation<NavigationProp<RootStackParamList>>()
  const {
    setDraughtTable,
    draughtTable,
    updateDraughtTable,
    uploadedTableData,
    removeResponse,
    getDraughtTable,
    isDraughtTableLoading,
  } = useSettings()
  const {vesselId} = useEntity()

  const [draughtCmMin, setDraughtCmMin] = useState<number | null>(null)
  const [draughtCmMax, setDraughtCmMax] = useState<number | null>(null)
  const [tonnageTMin, setTonnageTMin] = useState<number | null>(null)
  const [tonnageTMax, setTonnageTMax] = useState<number | null>(null)
  const [dataForTable, setDataForTable] = useState<TableItem[]>([])
  const [changedData, setChangedData] = useState<TableItem[]>([])
  const [shouldRecalculateValue, setShouldRecalculateValue] =
    useState<boolean>(false)
  const [draughtError, setDraughtError] = useState<boolean>(false)
  const [tonnageError, setTonnageError] = useState<boolean>(false)

  useEffect(() => {
    console.log('DATA_FOR_TABLE', dataForTable)
  }, [dataForTable])

  useEffect(() => {
    console.log('DRAUGHT_ERROR', draughtError)
  }, [draughtError])

  useEffect(() => {
    getDraughtTable(vesselId)
    if (uploadedTableData.length > 2) {
      const userChangedData = uploadedTableData.filter(
        (item: DraughtTableItem, index: number) =>
          index !== 0 && index !== uploadedTableData.length - 1
      )
      const changes = userChangedData.map((item: TableItem) => {
        return {
          draught: item.draught,
          tonnage: item.tonnage,
        }
      })
      setChangedData(changes)
    }
  }, [])

  useEffect(() => {
    setShouldRecalculateValue(false)
    if (draughtTable.length) {
      if (draughtTable.length === 2) {
        setDraughtCmMin(draughtTable[0].draught)
        setDraughtCmMax(draughtTable[1].draught)
        setTonnageTMin(draughtTable[0].tonnage)
        setTonnageTMax(draughtTable[1].tonnage)
      }
      if (draughtTable.length > 2) {
        setDraughtCmMin(draughtTable[0].draught)
        setDraughtCmMax(draughtTable[draughtTable.length - 1].draught)
        setTonnageTMin(draughtTable[0].tonnage)
        setTonnageTMax(draughtTable[draughtTable.length - 1].tonnage)
        setDataForTable(draughtTable)
      }
    }
  }, [draughtTable])

  useEffect(() => {
    setDataForTable(draughtTable)
  }, [draughtTable])

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
      tonnageTMax !== null &&
      !draughtError &&
      !tonnageError &&
      shouldRecalculateValue
    ) {
      console.log('DRAUGHT_ERROR', draughtError)
      setDataForTable(
        calculateTable(tonnageTMax, tonnageTMin, draughtCmMax, draughtCmMin)
      )
      setChangedData([])
    }
  }, [
    draughtCmMin,
    draughtCmMax,
    tonnageTMin,
    tonnageTMax,
    shouldRecalculateValue,
    draughtError,
    tonnageError,
  ])

  const onInputChange = (
    draughtMin: number,
    draughtMax: number,
    tonnageMin: number,
    tonnageMax: number,
    val: number,
    identifier: string
  ) => {
    console.log(draughtMin, draughtMax, tonnageMin, tonnageMax, val, identifier)
    setChangedData([])
    setDraughtError(false)
    setTonnageError(false)
    if (draughtMin >= draughtMax && draughtMin && draughtMax) {
      setDraughtError(true)
    }
    if (tonnageMin >= tonnageMax && tonnageMin && tonnageMax) {
      setTonnageError(true)
    }
    if (identifier === 'draughtCmMax') {
      setDraughtCmMax(Number(val))
    }
    if (identifier === 'draughtCmMin') {
      console.log('DRAUGHT_CM_MIN_SET')
      setDraughtCmMin(Number(val))
    }
    if (identifier === 'tonnageTMax') {
      setTonnageTMax(Number(val))
    }
    if (identifier === 'tonnageTMin') {
      setTonnageTMin(Number(val))
    }
  }

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

  const handleOnSave = async () => {
    let changedDataToUpload
    const formattedChangedData = changedData.map(item => {
      return {
        draught: item.draught,
        tonnage: item.tonnage,
      }
    })
    if (
      shouldRecalculateValue &&
      draughtCmMin !== null &&
      draughtCmMax !== null &&
      tonnageTMin !== null &&
      tonnageTMax !== null
    ) {
      changedDataToUpload = [
        {
          draught: draughtCmMin,
          tonnage: tonnageTMin,
        },
        ...formattedChangedData,
        {
          draught: draughtCmMax,
          tonnage: tonnageTMax,
        },
      ]
      for (const item of uploadedTableData) {
        if (
          !changedDataToUpload.find(element => element.draught === item.draught)
        ) {
          await removeResponse(item.id)
        }
      }
    } else {
      changedDataToUpload = [...formattedChangedData]
    }
    for (const element of changedDataToUpload) {
      const existedItem = uploadedTableData.find(
        (item: DraughtTableItem) => parseFloat(item.draught) === element.draught
      )
      if (existedItem) {
        await updateDraughtTable(element, existedItem.id)
      } else {
        await updateDraughtTable(element)
      }
    }
    setDraughtTable(dataForTable)
    setDraughtCmMin(null)
    setDraughtCmMax(null)
    setTonnageTMin(null)
    setTonnageTMax(null)
    setDataForTable([])
    setChangedData([])
    navigation.goBack()
  }

  const renderItem = ({item, index}: {item: TableItem; index: number}) => {
    return (
      <HStack
        backgroundColor={
          (index / 2) % 1 === 0 ? Colors.white : Colors.tableGreyBackground
        }
        alignItems="center"
        borderBottomColor={Colors.light}
        borderBottomWidth={1}
        borderTopColor={index === 0 ? Colors.light : null}
        borderTopWidth={index === 0 ? 1 : 0}
        h={ms(58)}
        w="100%"
      >
        <Box
          borderRightColor={Colors.light}
          borderRightWidth={1}
          h={'100%'}
          justifyContent="center"
          px={ms(6)}
          w={ms(96)}
        >
          <Text my={0} py={0}>
            {item.draught.toString()}
          </Text>
        </Box>
        <OTPInput
          getValue={val => {
            if (val) {
              addUserChangedData({
                draught: item.draught,
                tonnage: parseFloat(val),
              })
            }
          }}
          decimalLength={3}
          errorMessage={'Too match'}
          initialValue={item.tonnage}
          isDisabled={index === 0 || index === dataForTable.length - 1}
          lineIndex={index}
          maxValue={tonnageTMax ? tonnageTMax : undefined}
          minValue={tonnageTMin ? tonnageTMin : undefined}
          numberLength={4}
          tableValue={item.draught}
        />
      </HStack>
    )
  }

  const keyExtractor = (item: TableItem) => item.draught.toString()

  if (isDraughtTableLoading) {
    return <LoadingAnimated />
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
            defaultValue={draughtCmMin ? draughtCmMin.toString() : ''}
            fontSize={ms(14)}
            h={ms(40)}
            keyboardType="number-pad"
            placeholder={t('enterNumber') as string}
            onEndEditing={val => {
              setShouldRecalculateValue(true)
              onInputChange(
                Number(val.nativeEvent.text),
                Number(draughtCmMax),
                Number(tonnageTMin),
                Number(tonnageTMax),
                Number(val.nativeEvent.text),
                'draughtCmMin'
              )
            }}
            // onEndEditing={}
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
            defaultValue={draughtCmMax ? draughtCmMax.toString() : ''}
            fontSize={ms(14)}
            h={ms(40)}
            keyboardType="number-pad"
            placeholder={t('enterNumber') as string}
            onEndEditing={val => {
              setShouldRecalculateValue(true)
              onInputChange(
                Number(draughtCmMin),
                Number(val.nativeEvent.text),
                Number(tonnageTMin),
                Number(tonnageTMax),
                Number(val.nativeEvent.text),
                'draughtCmMax'
              )
            }}
          />
        </FormControl>
      </HStack>
      {draughtError ? (
        <Text color={Colors.offlineWarning} textAlign="center" w="100%">
          {t('enteredValuesAreWrong')}
        </Text>
      ) : null}
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
            defaultValue={tonnageTMin ? tonnageTMin.toString() : ''}
            fontSize={ms(14)}
            h={ms(40)}
            keyboardType="number-pad"
            placeholder={t('enterNumber') as string}
            onEndEditing={val => {
              setShouldRecalculateValue(true)
              onInputChange(
                Number(draughtCmMin),
                Number(draughtCmMax),
                Number(val.nativeEvent.text),
                Number(tonnageTMax),
                Number(val.nativeEvent.text),
                'tonnageTMin'
              )
            }}
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
            defaultValue={tonnageTMax ? tonnageTMax.toString() : ''}
            fontSize={ms(14)}
            h={ms(40)}
            keyboardType="number-pad"
            placeholder={t('enterNumber') as string}
            onEndEditing={val => {
              setShouldRecalculateValue(true)
              onInputChange(
                Number(draughtCmMin),
                Number(draughtCmMax),
                Number(tonnageTMin),
                Number(val.nativeEvent.text),
                Number(val.nativeEvent.text),
                'tonnageTMax'
              )
            }}
          />
        </FormControl>
      </HStack>
      {tonnageError ? (
        <Text color={Colors.offlineWarning} textAlign="center" w="100%">
          {t('enteredValuesAreWrong')}
        </Text>
      ) : null}
      <Divider mb={ms(20)} mt={ms(10)} />
      {dataForTable.length ? (
        <Box
          borderColor={Colors.light}
          borderRadius={5}
          borderWidth={1}
          flex={1}
        >
          <HStack>
            <Box
              borderRightColor={Colors.light}
              borderRightWidth={1}
              px={ms(6)}
              py={ms(8)}
              w={ms(96)}
            >
              <Text color={Colors.disabled} fontSize={ms(12)}>
                Draught (cm)
              </Text>
            </Box>
            <Box px={ms(6)} py={ms(8)}>
              <Text color={Colors.disabled} fontSize={ms(12)}>
                Tonnage (T)
              </Text>
            </Box>
          </HStack>
          <FlashList
            data={dataForTable}
            estimatedItemSize={ms(58)}
            keyExtractor={keyExtractor}
            // maxToRenderPerBatch={8}
            renderItem={renderItem}
          />
        </Box>
      ) : null}
      <HStack
        alignItems="flex-end"
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
            handleOnSave()
          }}
        >
          <Text bold color={Colors.white} fontSize={ms(16)}>
            {t('save')}
          </Text>
        </Button>
      </HStack>
    </Box>
  )
}

export default MeasurementTable
