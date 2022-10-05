// import React, {useEffect, useRef, useState} from 'react'
// import {
//   StyleSheet,
//   Dimensions,
//   View,
//   TouchableOpacity,
//   Platform,
// } from 'react-native'
// import {
//   Container,
//   Content,
//   Text,
//   Thumbnail,
//   Button,
//   Grid,
//   Row,
//   Col,
//   Spinner,
// } from 'native-base'
// import Carousel from 'react-native-snap-carousel'
// import DocumentScanner from 'react-native-document-scanner'
// import RNImageToPdf from 'react-native-image-to-pdf'
// import {request, PERMISSIONS} from 'react-native-permissions'
// import RNFetchBlob from 'rn-fetch-blob'
// import FontAwesome5Pro from 'react-native-vector-icons/FontAwesome5Pro'
// import {debounce} from 'lodash'

// export default function PDFDocumentScanner() {
//   const [showManualCaptureButton, setShowManualCaptureButton] = useState(false)
//   const [cameraActive, setCameraActive] = useState(false)
//   const [isLoading, setIsLoading] = useState(false)
//   const [imagePaths, setImagePaths] = useState<any>([])

//   const scannerRef = useRef<DocumentScanner>()
//   const carouselRef = useRef<Carousel>()
//   const timeout = useRef<any>()

//   useEffect(() => {
//     const init = async () => {
//       let cameraResponse = await request(
//         Platform.OS === 'ios'
//           ? PERMISSIONS.IOS.CAMERA
//           : PERMISSIONS.ANDROID.CAMERA
//       )

//       let storageResponse = null
//       if (Platform.OS === 'android') {
//         storageResponse = await request(
//           PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE
//         )
//       }
//       if (
//         cameraResponse !== 'granted' ||
//         (Platform.OS === 'android' && storageResponse !== 'granted')
//       ) {
//         // Actions.pop()
//       }
//       launchScanner()
//     }

//     init()

//     return () => {
//       clearTimeout(timeout.current)
//     }
//   }, [])

//   const launchScanner = () => {
//     setCameraActive(true)
//     timeout.current = setTimeout(() => {
//       setShowManualCaptureButton(true)
//     }, 5000)
//   }

//   const discardScan = () => {
//     removeTemporaryFiles()
//     Actions.pop()
//   }
//   const retryScan = async () => {
//     await removeTemporaryFile(imagePaths.slice(-1)[0])
//     setImagePaths(imagePaths?.slice(0, -1))
//     launchScanner()
//   }
//   const scanAdditionalPage = () => {
//     launchScanner()
//   }
//   const approveScan = async () => {
//     let pdf = await RNImageToPdf.createPDFbyImages({
//       imagePaths: imagePaths?.map(p => p.replace('file://', '')),
//       name: 'VemasysPDF',
//     })
//     // if (this.props && this.props.onScanApprove) {
//     //   this.setState({
//     //     ...this.state,
//     //     loading: true,
//     //   })
//     //   try {
//     //     await this.props.onScanApprove({
//     //       pdfPath: pdf.filePath,
//     //     })
//     //   } catch {
//     //     showErrorToast('Document upload failed.')
//     //   }
//     // }

//     await removeTemporaryFiles()
//     Actions.pop()
//   }

//   const getPathFromData = (data: any) => {
//     const basePath = 'file://'

//     if (Platform.OS === 'android') {
//       return data.croppedImage ? data.croppedImage : data.initialImage
//     } else if (Platform.OS === 'ios') {
//       return `${basePath}${
//         data.croppedImage ? data.croppedImage : data.initialImage
//       }`
//     }

//     return null
//   }

//   const handlePictureTaken = (data: any) => {
//     clearTimeout(timeout.current)
//     const path = getPathFromData(data)
//     setCameraActive(false)
//     setShowManualCaptureButton(false)
//     setIsLoading(false)
//     setImagePaths(imagePaths?.concat([path]))
//   }

//   const removeTemporaryFile = async (path: string) => {
//     if (await RNFetchBlob.fs.exists(path)) {
//       await RNFetchBlob.fs.unlink(path)
//     }
//   }
//   const removeTemporaryFiles = async () => {
//     await Promise.all(imagePaths.map((p: string) => removeTemporaryFile(p)))
//   }

//   const renderImagePreview = ({item, index}: any) => {
//     return (
//       <View style={styles.imagePreview}>
//         <Thumbnail
//           style={styles.imagePreviewImage}
//           square
//           source={{uri: item}}
//         />
//         <Text style={styles.imagePreviewLabel}>
//           Page {index + 1} of {imagePaths.length}
//         </Text>
//       </View>
//     )
//   }

//   return (
//     <Container>
//       <Content contentContainerStyle={styles.container}>
//         {showManualCaptureButton && (
//           <Button
//             onPress={() => scannerRef.current?.capture()}
//             rounded="3xl"
//             dark
//             style={styles.captureButton}
//           >
//             <FontAwesome5Pro
//               name="camera"
//               size={45}
//               color="white"
//               style={{
//                 marginLeft: 25,
//                 marginRight: 25,
//                 marginBottom: 15,
//                 marginTop: 15,
//               }}
//               solid
//             />
//           </Button>
//         )}
//         {cameraActive ? (
//           <DocumentScanner
//             ref={scannerRef}
//             contrast={1.1}
//             noGrayScale={true}
//             style={styles.scanner}
//             onPictureTaken={() =>
//               debounce(handlePictureTaken, 250, {
//                 leading: true,
//                 trailing: false,
//               })
//             }
//             enableTorch={false}
//             overlayColor="rgba(255,130,0, 0.7)"
//             detectionCountBeforeCapture={5}
//           />
//         ) : imagePaths.length ? (
//           <Grid>
//             <Row size={4}>
//               {isLoading ? (
//                 <Col style={styles.actionButtonContainer}>
//                   <Spinner />
//                 </Col>
//               ) : (
//                 <Carousel
//                   ref={carouselRef}
//                   data={imagePaths}
//                   renderItem={renderImagePreview}
//                   sliderWidth={Dimensions.get('window').width}
//                   itemWidth={300}
//                   layout={'default'}
//                   containerCustomStyle={styles.imagePreviewContainer}
//                   firstItem={imagePaths.length - 1}
//                 />
//               )}
//             </Row>
//             <Row size={1}>
//               <Col style={styles.actionButtonContainer}>
//                 <TouchableOpacity
//                   style={styles.actionButton}
//                   disabled={isLoading}
//                   onPress={() => scanAdditionalPage()}
//                 >
//                   <FontAwesome5Pro
//                     name="plus"
//                     size={25}
//                     style={styles.actionButtonIcon}
//                     light
//                   />
//                 </TouchableOpacity>
//               </Col>
//               <Col style={styles.actionButtonContainer}>
//                 <TouchableOpacity
//                   style={styles.actionButton}
//                   disabled={isLoading}
//                   onPress={() => discardScan()}
//                 >
//                   <FontAwesome5Pro
//                     name="times"
//                     size={25}
//                     style={styles.actionButtonIcon}
//                   />
//                 </TouchableOpacity>
//               </Col>
//               <Col style={styles.actionButtonContainer}>
//                 <TouchableOpacity
//                   style={styles.actionButton}
//                   disabled={isLoading}
//                   onPress={() => retryScan()}
//                 >
//                   <FontAwesome5Pro
//                     name="redo"
//                     size={25}
//                     style={styles.actionButtonIcon}
//                   />
//                 </TouchableOpacity>
//               </Col>
//               <Col style={styles.actionButtonContainer}>
//                 <TouchableOpacity
//                   style={styles.actionButton}
//                   disabled={isLoading}
//                   onPress={() => approveScan()}
//                 >
//                   <FontAwesome5Pro
//                     name="check"
//                     size={25}
//                     style={styles.actionButtonIcon}
//                   />
//                 </TouchableOpacity>
//               </Col>
//             </Row>
//           </Grid>
//         ) : null}
//       </Content>
//     </Container>
//   )
// }

// const styles = StyleSheet.create({
//   container: {
//     height: '100%',
//     width: '100%',
//   },
//   scanner: {
//     flex: 1,
//     width: '100%',
//     height: '100%',
//     backgroundColor: '#fff',
//   },
//   imagePreview: {
//     flex: 1,
//   },
//   imagePreviewImage: {
//     height: null,
//     width: null,
//     flex: 1,
//     resizeMode: 'contain',
//   },
//   imagePreviewContainer: {
//     backgroundColor: '#F2F2F2',
//     height: '100%',
//     width: '100%',
//   },
//   imagePreviewLabel: {
//     position: 'absolute',
//     alignSelf: 'center',
//     bottom: 5,
//     padding: 5,
//     borderRadius: 5,
//     backgroundColor: 'rgba(242, 242, 242, 0.75)',
//   },
//   actionButtonContainer: {
//     justifyContent: 'center',
//   },
//   actionButton: {
//     paddingTop: 30,
//     paddingBottom: 30,
//     width: '100%',
//   },
//   actionButtonIcon: {
//     fontSize: 40,
//     textAlign: 'center',
//   },
//   captureButton: {
//     position: 'absolute',
//     bottom: 20,
//     zIndex: 99,
//     alignSelf: 'center',
//     height: null,
//     ...Platform.select({
//       ios: {
//         paddingTop: 0,
//         paddingBottom: 0,
//       },
//     }),
//   },
// })
