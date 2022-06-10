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
  const sheetRef = useRef(null);
  const [snapStatus, setSnapStatus] = useState(0);

  // const renderBottomContent = () => (
  //   <View
  //     style={{
  //       backgroundColor: 'white',
  //       height: 500,
  //       paddingHorizontal: 30,
  //       paddingVertical: 20,
  //     }}>
  //     <TouchableOpacity
  //       style={{
  //         alignSelf: 'center',
  //         width: 80,
  //         height: 3,
  //         backgroundColor: '#23475C',
  //         borderRadius: 5,
  //       }}
  //       onPress={() => sheetRef.current.snapTo(0)}
  //     />
  //     <Text
  //       style={{
  //         fontSize: 18,
  //         marginVertical: 20,
  //         fontWeight: '700',
  //         textAlign: 'center',
  //         color: '#44A7B9',
  //       }}>
  //       Vessel Name Here
  //     </Text>
  //     {/* {snapStatus === 1 && <PreviousNavLogInfo />}
  //     <CurrentNavLogInfo />
  //     {snapStatus === 1 && <PlannedNavLogInfo />}
  //     {snapStatus === 1 && <Button label={'View Navlog'} />} */}
  //   </View>
  // );

  return (
    <View style={styles.container}>
      <MapView
        provider={PROVIDER_GOOGLE} // remove if not using Google Maps
        style={styles.map}
        region={{
          latitude: 37.78825,
          longitude: -122.4324,
          latitudeDelta: 0.015,
          longitudeDelta: 0.0121,
        }}>
        <Marker
          key={1}
          coordinate={{latitude: 37.78825, longitude: -122.4324}}
          title="Sample Marker"
          description="Sample Description"
        />
      </MapView>
      {/* <BottomSheet
        ref={sheetRef}
        initialSnap={1}
        snapPoints={[420, 180]}
        borderRadius={20}
        renderContent={renderBottomContent}
        onOpenEnd={() => setSnapStatus(1)}
        onCloseEnd={() => setSnapStatus(0)}
      /> */}
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
