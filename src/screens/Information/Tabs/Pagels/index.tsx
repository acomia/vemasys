import React, {useEffect, useState} from 'react'
import {TouchableOpacity} from 'react-native'
import {
  Box,
  Divider,
  HStack,
  Icon,
  Image,
  Input,
  ScrollView,
  Text,
} from 'native-base'
import MaterialIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import {useNavigation} from '@react-navigation/native'
import {ms} from 'react-native-size-matters'
import {useTranslation} from 'react-i18next'

import {useEntity, useInformation} from '@bluecentury/stores'
import {Icons} from '@bluecentury/assets'
import {LoadingAnimated} from '@bluecentury/components'
import {Colors} from '@bluecentury/styles'
import {EXTERNAL_PEGEL_IMAGE_URL} from '@bluecentury/constants'

const Pegels = () => {
  const {t} = useTranslation()
  const navigation = useNavigation()
  const {isInformationLoading, pegels, streamGauges, getVesselPegels} =
    useInformation()
  const {vesselId} = useEntity()
  const [searchedValue, setSearchedValue] = useState('')
  const [pegelsData, setPegelsData] = useState([])

  useEffect(() => {
    getVesselPegels('')
    /* eslint-disable react-hooks/exhaustive-deps */
    /* eslint-disable react-native/no-inline-styles */
  }, [vesselId])

  useEffect(() => {
    setPegelsData(pegels)
  }, [pegels])

  const renderPegelList = (pegel: any) => (
    <HStack
      key={pegel.id}
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
      <HStack alignItems="center" flex="2">
        <TouchableOpacity
          style={{
            borderWidth: 1,
            borderColor: Colors.light,
            borderRadius: 5,
            marginRight: 5,
          }}
          activeOpacity={0.7}
          onPress={() =>
            navigation.navigate('InformationPegelDetails', {pegelId: pegel.id})
          }
        >
          <MaterialIcons name="history" size={ms(20)} />
        </TouchableOpacity>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => onSelectPegel(pegel)}
        >
          <Text color={Colors.primary} fontWeight="medium">
            {pegel?.name}
          </Text>
        </TouchableOpacity>
      </HStack>
      <HStack alignItems="center" flex="1" justifyContent="space-between">
        <Image
          source={
            pegel.lastMeasurement && pegel.secondToLastMeasurement
              ? pegel.lastMeasurement.measureValue -
                  pegel.secondToLastMeasurement.measureValue >
                0
                ? Icons.water_rise
                : Icons.water_low
              : Icons.water_normal
          }
          alt={`Pegels-WaterLevel-${pegel.id}`}
        />
        {pegel?.lastMeasurement && pegel?.lastMeasurement.measureValue ? (
          <Text
            bold
            color={
              pegel.lastMeasurement && pegel.secondToLastMeasurement
                ? pegel?.lastMeasurement?.measureValue -
                    pegel?.secondToLastMeasurement?.measureValue >
                  0
                  ? Colors.secondary
                  : Colors.danger
                : Colors.highlighted_text
            }
          >
            {Math.trunc(pegel.lastMeasurement.measureValue)} cm
          </Text>
        ) : (
          <Text bold>{t('n/a')}</Text>
        )}
      </HStack>
    </HStack>
  )

  const renderStreamGauges = () => {
    return streamGauges?.map(pegel => renderPegelList(pegel))
  }

  const renderPegels = () => {
    return pegelsData?.map((river: any, index: number) => (
      <Box key={`river-${index}`} mt={ms(20)}>
        <Text bold color={Colors.text} fontSize={ms(16)} ml={ms(10)}>
          {river?.riverName}
        </Text>
        <Divider mb={ms(15)} mt={ms(5)} />
        {river?.streamGauges
          ?.sort((a: any, b: any) => `${a.name}`.localeCompare(b.name))
          ?.filter((pegel: any) => !pegel.isStreamGaugeReference)
          ?.map((pegel: any) => renderPegelList(pegel))}
      </Box>
    ))
  }

  const renderEmpty = () => (
    <Text
      bold
      color={Colors.text}
      fontSize={ms(15)}
      mt={ms(10)}
      textAlign="center"
    >
      {t('noPegels')}
    </Text>
  )

  const onSelectPegel = (pegel: any) => {
    if (pegel.elwisPegelId === null) {
      navigation.navigate('ImgViewer', {
        url: `${EXTERNAL_PEGEL_IMAGE_URL}/wasserstaendeUebersichtGrafik.png.php?pegelId=&dfh=0`,
        title: pegel.name,
      })
    } else {
      navigation.navigate('ImgViewer', {
        url: `${EXTERNAL_PEGEL_IMAGE_URL}/wasserstaendeUebersichtGrafik.png.php?pegelId=${pegel.elwisPegelId}&dfh=0`,
        title: pegel.name,
      })
    }
  }

  const onSearchPegel = (val: string) => {
    setSearchedValue(val)
    getVesselPegels(val)
  }

  return (
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
        placeholder="Search for pegels..."
        placeholderTextColor={Colors.disabled}
        size="sm"
        value={searchedValue}
        variant="filled"
        onChangeText={e => onSearchPegel(e)}
      />
      <Divider my={ms(15)} />
      <ScrollView
        contentContainerStyle={{flexGrow: 1, paddingBottom: 20}}
        maximumZoomScale={5}
        minimumZoomScale={1}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
      >
        <HStack alignItems="center" mt={ms(10)} px={ms(10)}>
          <Text bold color={Colors.text} flex="1" fontSize={ms(16)}>
            {t('details')}
          </Text>
          <Text bold color={Colors.text} fontSize={ms(16)}>
            {t('level')}
          </Text>
        </HStack>
        <Divider mb={ms(15)} mt={ms(5)} />
        {streamGauges?.length === 0 &&
        pegels?.length === 0 &&
        !isInformationLoading
          ? renderEmpty()
          : null}
        {isInformationLoading ? (
          <LoadingAnimated />
        ) : (
          <>
            {renderStreamGauges()}
            {renderPegels()}
          </>
        )}
      </ScrollView>
    </Box>
  )
}

export default Pegels
