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
import {useEntity} from '@bluecentury/stores'
import {usePlanning} from '@bluecentury/stores'
import {NavigationLog} from '@bluecentury/models'

interface Props {
  navLog: NavigationLog
}

export default (props: Props) => {
  const {t} = useTranslation()
  const [statusActive, setStatusActive] = useState<number>(0)
  const [refreshing, setRefreshing] = useState<boolean>(false)
  const [selectedButton, setSelectedButton] = useState<string>('')
  const [isOpenInput, setIsOpenInput] = useState<boolean>(false)
  const [measurement, setMeasurement] = useState<string>('')
  const [measurementValue, setMeasurementValue] = useState<string>('')
  const [draughtValues, setDraughtValues] = useState({
    BBV: 0,
    BBM: 0,
    BBA: 0,
    SBV: 0,
    SBM: 0,
    SBA: 0,
  })

  const {
    maxDraught,
    navigationLogDetails,
    tonnageCertificates,
    getTonnageCertifications,
    getNavigationLogDetails,
    getVesselnavigationDetails,
    vesselNavigationDetails,
  } = usePlanning()
  const measurements = [
    {value: 'freeboard', label: t('freeboardMeasurement')},
    {value: 'draught', label: t('draughtMeasurement')},
  ]

  useEffect(() => {
    getTonnageCertifications(navigationLogDetails?.exploitationVessel?.id)
    getVesselnavigationDetails(navigationLogDetails?.exploitationVessel?.id)
  }, [])

  const buttonSelected = (selected: string) => {
    setSelectedButton(selected)
    setIsOpenInput(true)

    if (draughtValues[selected] > 0) {
      setMeasurementValue(draughtValues[selected])
    }
  }

  const closeInput = () => {
    setMeasurementValue('')
    setIsOpenInput(false)
  }

  return (
    <PageScroll refreshing={refreshing}>
      <Text bold color={Colors.azure} fontSize={ms(20)}>
        Draught Calculator
      </Text>
      <Divider bg={Colors.light} h={ms(2)} my={ms(8)} />
      <BeforeAfterComponent active={statusActive} setActive={setStatusActive} />
      <Box py={ms(10)}>
        <HStack>
          <Text color={Colors.disabled}>Select measurement </Text>
          <Text color={Colors.danger}>*</Text>
        </HStack>
        <Select
          accessibilityLabel=""
          bg={Colors.light_grey}
          fontSize={ms(16)}
          fontWeight="medium"
          minWidth="300"
          placeholder=""
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
      <Box>
        <Ship
          maxDraught={
            measurement === measurements[0].value
              ? 0
              : maxDraught || vesselNavigationDetails?.physicalVessel?.draught
          }
          buttonSelected={buttonSelected}
          draughtValues={draughtValues}
          tonnage={vesselNavigationDetails?.physicalVessel?.weight}
        />
      </Box>
      <HStack mt={ms(10)} space={ms(5)}>
        <Button colorScheme={'white'} flex={1}>
          <Text color={Colors.disabled}>{t('endLoading')}</Text>
        </Button>
        <Button
          colorScheme={!measurement ? 'gray' : null}
          disabled={!measurement}
          flex={1}
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
                measurement === measurements[0].value
                  ? '0'
                  : vesselNavigationDetails?.physicalVessel?.draught
              }
              keyboardType="numeric"
              value={measurementValue}
              onChangeText={value => {
                setMeasurementValue(value)
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
                  setDraughtValues({
                    ...draughtValues,
                    [selectedButton]: parseInt(measurementValue),
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
