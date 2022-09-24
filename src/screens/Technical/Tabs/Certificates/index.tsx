import React, {useEffect, useState} from 'react'
import {Dimensions, RefreshControl, TouchableOpacity} from 'react-native'
import {Box, HStack, Image, ScrollView, Text} from 'native-base'
import {ms} from 'react-native-size-matters'
import {useNavigation} from '@react-navigation/native'

import {useEntity, useTechnical} from '@bluecentury/stores'
import {Colors} from '@bluecentury/styles'
import {LoadingIndicator} from '@bluecentury/components'
import {Icons} from '@bluecentury/assets'

const {width} = Dimensions.get('window')

const Certificates = () => {
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
      label: 'All Certificates',
      icon: Icons.all_certificate,
      count: certificates?.length,
      data: certificates
    },
    {
      label: 'Valid',
      icon: Icons.status_check_alt,
      count: certificates?.filter(cert => cert.remainingDays >= 0).length,
      data: certificates?.filter(cert => cert.remainingDays >= 0)
    },
    {
      label: 'Expiring',
      icon: Icons.status_exclamation_alt,
      count: certificates?.filter(cert => cert.remainingDays == 31).length,
      data: certificates?.filter(cert => cert.remainingDays == 31)
    },
    {
      label: 'Expired',
      icon: Icons.status_x_alt,
      count: certificates?.filter(cert => cert.remainingDays < 0).length,
      data: certificates?.filter(cert => cert.remainingDays < 0)
    }
  ]

  const onPullRefresh = () => {
    setPullRefresh(true)
    getVesselCertificates(vesselId)
    setPullRefresh(false)
  }

  // if (isTechnicalLoading) return <LoadingIndicator />

  return (
    <Box flex="1">
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          paddingBottom: 20
        }}
        scrollEventThrottle={16}
        refreshControl={
          <RefreshControl onRefresh={onPullRefresh} refreshing={pullRefresh} />
        }
        px={ms(12)}
        py={ms(20)}
        bg={Colors.white}
      >
        <Text
          fontSize={ms(20)}
          fontWeight="bold"
          color={Colors.azure}
          mb={ms(15)}
        >
          Overview
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
                      title: certCard.label
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
                    <Text
                      fontSize={ms(22)}
                      fontWeight="bold"
                      color={Colors.text}
                    >
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
            <LoadingIndicator />
          )}
        </HStack>
      </ScrollView>
    </Box>
  )
}

export default Certificates
