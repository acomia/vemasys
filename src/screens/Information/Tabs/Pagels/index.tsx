import React, {useEffect, useState} from 'react'
import {TouchableOpacity, Modal} from 'react-native'
import {
  Box,
  Divider,
  HStack,
  Icon,
  Image,
  Input,
  ScrollView,
  Text
} from 'native-base'
import MaterialIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import {useNavigation} from '@react-navigation/native'
import {ms} from 'react-native-size-matters'
import ImageViewer from 'react-native-image-zoom-viewer'
import moment from 'moment'

import {useInformation} from '@bluecentury/stores'
import {Icons} from '@bluecentury/assets'
import {IconButton, LoadingIndicator} from '@bluecentury/components'
import {Colors} from '@bluecentury/styles'
import {EXTERNAL_PEGEL_IMAGE_URL} from '@bluecentury/constants'

const Pegels = () => {
  const navigation = useNavigation()
  const {isInformationLoading, pegels, streamGauges, getVesselPegels} =
    useInformation()
  const [searchedValue, setSearchedValue] = useState('')
  const [pegelsData, setPegelsData] = useState([])
  const [imgModal, setImgModal] = useState(false)
  const [imgSource, setImgSource] = useState([{url: ''}])
  const [selectedPegel, setSelectedPegel] = useState(null)

  useEffect(() => {
    getVesselPegels('')
  }, [])

  useEffect(() => {
    setPegelsData(pegels)
  }, [pegels])

  const renderPegelList = (pegel: any) => (
    <HStack
      key={pegel.id}
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
      <HStack flex="2" alignItems="center">
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() =>
            navigation.navigate('InformationPegelDetails', {pegelId: pegel.id})
          }
          style={{
            borderWidth: 1,
            borderColor: Colors.light,
            borderRadius: 5,
            marginRight: 5
          }}
        >
          <MaterialIcons name="history" size={ms(20)} />
        </TouchableOpacity>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => onSelectPegel(pegel)}
        >
          <Text fontWeight="medium" color={Colors.primary}>
            {pegel?.name}
          </Text>
        </TouchableOpacity>
      </HStack>
      <HStack flex="1" alignItems="center" justifyContent="space-between">
        <Image
          alt={`Pegels-WaterLevel-${pegel.id}`}
          source={
            pegel.lastMeasurement && pegel.secondToLastMeasurement
              ? pegel.lastMeasurement.measureValue -
                  pegel.secondToLastMeasurement.measureValue >
                0
                ? Icons.water_rise
                : Icons.water_low
              : Icons.water_normal
          }
        />
        {pegel?.lastMeasurement && pegel?.lastMeasurement.measureValue ? (
          <Text
            fontWeight="bold"
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
          <Text fontWeight="bold">N/A</Text>
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
        <Text
          fontSize={ms(16)}
          fontWeight="bold"
          color={Colors.text}
          ml={ms(10)}
        >
          {river?.riverName}
        </Text>
        <Divider mt={ms(5)} mb={ms(15)} />
        {river?.streamGauges
          ?.sort((a: any, b: any) => `${a.name}`.localeCompare(b.name))
          ?.filter((pegel: any) => !pegel.isStreamGaugeReference)
          ?.map((pegel: any) => renderPegelList(pegel))}
      </Box>
    ))
  }

  const renderEmpty = () => (
    <Text
      fontSize={ms(15)}
      fontWeight="bold"
      textAlign="center"
      color={Colors.text}
      mt={ms(10)}
    >
      No Pegels.
    </Text>
  )

  const onSelectPegel = (pegel: any) => {
    setSelectedPegel(pegel)
    setImgModal(true)
    if (pegel.elwisPegelId === null) {
      let newArr = [
        {
          url: `${EXTERNAL_PEGEL_IMAGE_URL}/wasserstaendeUebersichtGrafik.png.php?pegelId=&dfh=0`
        }
      ]
      setImgSource(newArr)
    } else {
      let newArr = [
        {
          url: `${EXTERNAL_PEGEL_IMAGE_URL}/wasserstaendeUebersichtGrafik.png.php?pegelId=${pegel.elwisPegelId}&dfh=0`
        }
      ]
      setImgSource(newArr)
    }
  }

  const onSearchPegel = (val: string) => {
    setSearchedValue(val)
    getVesselPegels(val)
  }

  return (
    <Box flex="1" px={ms(12)} py={ms(15)} bg={Colors.white}>
      <Input
        w={{
          base: '100%'
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
        placeholder="Search for pegels..."
        variant="filled"
        size="sm"
        value={searchedValue}
        onChangeText={e => onSearchPegel(e)}
      />
      <Divider my={ms(15)} />
      <ScrollView
        minimumZoomScale={1}
        maximumZoomScale={5}
        contentContainerStyle={{flexGrow: 1, paddingBottom: 20}}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
      >
        <HStack mt={ms(10)} alignItems="center" px={ms(10)}>
          <Text
            flex="1"
            fontSize={ms(16)}
            fontWeight="bold"
            color={Colors.text}
          >
            Details
          </Text>
          <Text fontSize={ms(16)} fontWeight="bold" color={Colors.text}>
            Level
          </Text>
        </HStack>
        <Divider mt={ms(5)} mb={ms(15)} />
        {streamGauges?.length === 0 &&
        pegels?.length === 0 &&
        !isInformationLoading
          ? renderEmpty()
          : null}
        {isInformationLoading ? (
          <LoadingIndicator />
        ) : (
          <>
            {renderStreamGauges()}
            {renderPegels()}
          </>
        )}
        {/* Preview external image */}
        <Modal
          visible={imgModal}
          transparent={true}
          animationType="slide"
          onRequestClose={() => setImgModal(false)}
        >
          <ImageViewer
            imageUrls={imgSource}
            renderFooter={() => (
              <Text
                color={Colors.white}
                fontWeight="medium"
                ml={ms(5)}
                mb={ms(5)}
              >
                Title.vms_Water_Levels: {selectedPegel?.name}
              </Text>
            )}
            renderIndicator={() => <></>}
          />
          <IconButton
            source={Icons.close}
            onPress={() => setImgModal(false)}
            size={ms(25)}
            styles={{position: 'absolute', right: 10, top: 5}}
            tintColor={Colors.white}
          />
        </Modal>
        {/* End preview external image */}
      </ScrollView>
    </Box>
  )
}

export default Pegels
