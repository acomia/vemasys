import React from 'react'
import {View, Text, Image, StyleSheet} from 'react-native'
import {SafeAreaView} from 'react-native-safe-area-context'
import {DrawerContentScrollView, DrawerItemList} from '@react-navigation/drawer'

import app from '../../../app.json'

export const Drawer = (props: any) => {
  return (
    <SafeAreaView style={drawerStyles.container}>
      <DrawerContentScrollView {...props}>
        <Image
          source={require('../../assets/images/logo.png')}
          resizeMode="contain"
          style={drawerStyles.logo}
        />
        <View style={drawerStyles.content}>
          <DrawerItemList {...props} />
        </View>
      </DrawerContentScrollView>
      <View style={drawerStyles.versionLabel}>
        <Text style={{color: '#ADADAD'}}>Version: {app.version}</Text>
      </View>
    </SafeAreaView>
  )
}

const drawerStyles = StyleSheet.create({
  container: {
    flex: 1
  },
  content: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 10
  },
  logo: {
    width: 200,
    height: 60,
    alignSelf: 'center',
    marginVertical: 20
  },
  versionLabel: {
    padding: 10,
    alignItems: 'center'
  }
})
