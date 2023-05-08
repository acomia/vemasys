import React, {useState, useEffect} from 'react'
import {
  Box,
  Text,
  Divider,
  Select,
  HStack,
  Button,
  Modal,
  Input,
} from 'native-base'
import {Colors} from '@bluecentury/styles'
import {ms} from 'react-native-size-matters'
import {BeforeAfterComponent, Ship} from './component'
import {useTranslation} from 'react-i18next'
import {PageScroll} from '@bluecentury/components'
import {usePlanning} from '@bluecentury/stores'
import {NavigationLog} from '@bluecentury/models'

export default () => {
  const {t} = useTranslation()

  const initialDraughtValues = {
    BBV: {value: 0, draughtValue: 0},
    BBM: {value: 0, draughtValue: 0},
    BBA: {value: 0, draughtValue: 0},
    SBV: {value: 0, draughtValue: 0},
    SBM: {value: 0, draughtValue: 0},
    SBA: {value: 0, draughtValue: 0},
  }

  const initialDidValueChange = {
    BBV: {didUpdate: false},
    BBM: {didUpdate: false},
    BBA: {didUpdate: false},
    SBV: {didUpdate: false},
    SBM: {didUpdate: false},
    SBA: {didUpdate: false},
  }

  const measurements = [
    {value: 'freeboard', label: t('freeboardMeasurement')},
    {value: 'draught', label: t('draughtMeasurement')},
  ]

  const [isBefore, setIsBefore] = useState<number>(0)
  const [refreshing, setRefreshing] = useState<boolean>(false)
  const [selectedButton, setSelectedButton] = useState<string>('')
  const [isOpenInput, setIsOpenInput] = useState<boolean>(false)
  const [measurement, setMeasurement] = useState<string>(measurements[0].value)
  const [measurementValue, setMeasurementValue] = useState<string>('')
  const [draughtValues, setDraughtValues] = useState(initialDraughtValues)
  const [didValueChange, setDidValueChange] = useState(initialDidValueChange)
  const [averageDraught, setAverageDraught] = useState({
    values: 0,
    draughtValue: 0,
  })
  const isFreeboard = measurement === measurements[0].value

  const unsavedChanges = Object.values(didValueChange).filter(
    value => value.didUpdate === true
  )

  const {
    navigationLogDetails,
    getVesselnavigationDetails,
    vesselNavigationDetails,
  } = usePlanning()

  const maxDraught = vesselNavigationDetails?.physicalVessel?.draught * 100
  const inputRegex = /^[0-9,.]*$/

  useEffect(() => {
    if (!vesselNavigationDetails) {
      getVesselnavigationDetails(navigationLogDetails?.exploitationVessel?.id)
    }
  }, [])

  useEffect(() => {
    if (draughtValues) {
      const values = Object.values(draughtValues)
      const average = values.reduce(
        (acc, val) =>
          isFreeboard && isBefore === 1
            ? acc + val?.draughtValue
            : acc + val?.value,
        0
      )
      setAverageDraught(average / values?.length)
    }
  }, [draughtValues, measurement, isBefore])

  const buttonSelected = (selected: string) => {
    setSelectedButton(selected)
    setIsOpenInput(true)
    if (draughtValues[selected].value > 0) {
      setMeasurementValue(draughtValues[selected]?.value)
    }
  }

  const closeInput = () => {
    setMeasurementValue('')
    setIsOpenInput(false)
  }

  const submitDraught = () => {
    console.log('test')
  }

  return (
    <PageScroll refreshing={refreshing}>
      <Text bold color={Colors.azure} fontSize={ms(20)}>
        {t('draughtCalculator')}
      </Text>
      <Divider bg={Colors.light} h={ms(2)} my={ms(8)} />
      <Box py={ms(10)}>
        <HStack space={ms(5)}>
          <Text color={Colors.disabled}>{t('selectMeasurement')}</Text>
          <Text color={Colors.danger}>*</Text>
        </HStack>
        <Select
          accessibilityLabel=""
          bg={Colors.light_grey}
          defaultValue={measurement}
          fontSize={ms(16)}
          fontWeight="medium"
          minWidth="300"
          placeholder=""
          selectedValue={measurement}
          onValueChange={itemValue => setMeasurement(itemValue)}
        >
          {measurements.map((measurement, index) => {
            return (
              <Select.Item
                key={index}
                label={measurement.label}
                value={measurement.value}
              />
            )
          })}
        </Select>
      </Box>
      <BeforeAfterComponent active={isBefore} setActive={setIsBefore} />
      <Box py={ms(10)}>
        <Ship
          active={isBefore}
          averageDraught={averageDraught}
          buttonSelected={buttonSelected}
          draughtValues={draughtValues}
          isFreeboard={isFreeboard}
          maxDraught={isFreeboard ? maxDraught : 0} // get the value from the endpoint nearest value of tonnage_certificate
          tonnage={0}
        />
      </Box>
      <HStack mt={ms(10)} space={ms(5)}>
        <Button colorScheme={'white'} flex={1}>
          <Text color={Colors.disabled}>{t('endLoading')}</Text>
        </Button>
        <Button
          colorScheme={!measurement && unsavedChanges.length ? 'gray' : null}
          disabled={!measurement && unsavedChanges.length < 1}
          flex={1}
          onPress={submitDraught}
        >
          <Text>{t('save')}</Text>
        </Button>
      </HStack>
      <Modal
        backgroundColor="blue"
        isOpen={isOpenInput}
        width={'full'}
        onClose={() => closeInput()}
      >
        <Modal.Content width={'full'}>
          <Modal.Header>
            {`${t('enterMeasurement')} (${selectedButton})`}
          </Modal.Header>
          <Modal.Body>
            <Input
              placeholder={
                isFreeboard
                  ? '0'
                  : vesselNavigationDetails?.physicalVessel?.draught
              }
              keyboardType="numeric"
              value={measurementValue}
              onChangeText={value => {
                if (inputRegex.test(value)) {
                  setMeasurementValue(value)
                }
              }}
            />
          </Modal.Body>
          <Modal.Footer>
            <HStack mt={ms(10)} space={ms(5)} width="100%">
              <Button
                colorScheme={'white'}
                flex={1}
                onPress={() => closeInput()}
              >
                <Text color={Colors.disabled}>{t('close')}</Text>
              </Button>
              <Button
                flex={1}
                onPress={() => {
                  const draughtValue =
                    measurementValue === '' ? 0 : parseInt(measurementValue)
                  setDraughtValues({
                    ...draughtValues,
                    [selectedButton]: {
                      value: draughtValue,
                      draughtValue: draughtValue - maxDraught,
                    },
                  })
                  setDidValueChange({
                    ...didValueChange,
                    [selectedButton]: {didUpdate: true},
                  })
                  closeInput()
                }}
              >
                <Text>{t('save')}</Text>
              </Button>
            </HStack>
          </Modal.Footer>
        </Modal.Content>
      </Modal>
    </PageScroll>
  )
}
