import React, {useRef, useState} from 'react';
import {View, StyleSheet, Text, Image, TouchableOpacity} from 'react-native';
import MapView, {
  PROVIDER_GOOGLE,
  Marker,
  Polyline,
  Callout,
} from 'react-native-maps';
import BottomSheet from 'reanimated-bottom-sheet';

// import {
//   PreviousNavLogInfo,
//   CurrentNavLogInfo,
//   PlannedNavLogInfo,
//   Button,
// } from '../../components';
// import { icons } from '../../constants';

export default function Map() {
  return (
    <View>
      <Text>Map</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    flex: 1,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
});
