import React, {useEffect, useState} from 'react'
import {Dimensions, RefreshControl, TouchableOpacity} from 'react-native'
import {Box, HStack, Image, ScrollView, Text} from 'native-base'
import {ms} from 'react-native-size-matters'
import {useNavigation} from '@react-navigation/native'

import {useEntity, useTechnical} from '@bluecentury/stores'
import {Colors} from '@bluecentury/styles'
import {LoadingAnimated} from '@bluecentury/components'
import {Icons} from '@bluecentury/assets'
import {useTranslation} from 'react-i18next'

const {width} = Dimensions.get('window')

const Certificates = () => {
  const {t} = useTranslation()
  const navigation = useNavigation()
  const {isTechnicalLoading, certificates, getVesselCertificates} =
    useTechnical()
  const {vesselId} = useEntity()
  const [pullRefresh, setPullRefresh] = useState(false)

  useEffect(() => {
    getVesselCertificates(vesselId)
  }, [vesselId])

  const certificareCard = [
    {
      label: t('allCertificates'),
      icon: Icons.all_certificate,
      count: certificates?.length,
      data: certificates,
    },
    {
      label: t('valid'),
      icon: Icons.status_check_alt,
      count: certificates?.filter(cert => cert.remainingDays >= 0).length,
      data: certificates?.filter(cert => cert.remainingDays >= 0),
    },
    {
      label: t('expiring'),
      icon: Icons.status_exclamation_alt,
      count: certificates?.filter(cert => cert.remainingDays == 31).length,
      data: certificates?.filter(cert => cert.remainingDays == 31),
    },
    {
      label: t('expired'),
      icon: Icons.status_x_alt,
      count: certificates?.filter(cert => cert.remainingDays < 0).length,
      data: certificates?.filter(cert => cert.remainingDays < 0),
    },
  ]

  const onPullRefresh = () => {
    setPullRefresh(true)
    getVesselCertificates(vesselId)
    setPullRefresh(false)
  }

  // if (isTechnicalLoading) return <LoadingAnimated />

  return (
    <Box flex="1">
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          paddingBottom: 20,
        }}
        scrollEventThrottle={16}
        refreshControl={
          <RefreshControl onRefresh={onPullRefresh} refreshing={pullRefresh} />
        }
        px={ms(12)}
        py={ms(20)}
        bg={Colors.white}
      >
        <Text fontSize={ms(20)} bold color={Colors.azure} mb={ms(15)}>
          {t('overview')}
        </Text>
        <HStack
          flexWrap="wrap"
          justifyContent="space-evenly"
          alignItems="center"
        >
          {certificareCard.length > 0 ? (
            certificareCard?.map((certCard: any, index) => {
              return (
                <TouchableOpacity
                  key={index}
                  activeOpacity={0.6}
                  onPress={() =>
                    navigation.navigate('TechnicalCertificateList', {
                      certificates: certCard.data,
                      title: certCard.label,
                    })
                  }
                >
                  <Box
                    w={width / 2 - 30}
                    p={ms(30)}
                    alignItems="center"
                    justifyContent="center"
                    bg={Colors.white}
                    borderRadius={ms(5)}
                    shadow={4}
                    mt={ms(10)}
                    mr={ms(10)}
                  >
                    <Image
                      alt={`${certCard.label}-icon`}
                      source={certCard.icon}
                      mb={ms(15)}
                    />
                    <Text fontSize={ms(22)} bold color={Colors.text}>
                      {certCard.count}
                    </Text>
                    <Text fontWeight="medium" color={Colors.text}>
                      {certCard.label}
                    </Text>
                  </Box>
                </TouchableOpacity>
              )
            })
          ) : (
            <LoadingAnimated />
          )}
        </HStack>
      </ScrollView>
    </Box>
  )
}

export default Certificates
