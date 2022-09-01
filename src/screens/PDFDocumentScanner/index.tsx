
import React, { useState, useEffect } from 'react'
import { } from 'react-native'
import { Image } from 'native-base';
import DocumentScanner from 'react-native-document-scanner-plugin'

export default function PDFDocumentScanner() {
  const [scannedImage, setScannedImage] = useState();

  const scanDocument = async () => {
    // start the document scanner
    const { scannedImages } = await DocumentScanner.scanDocument()

    // get back an array with scanned image file paths
    if (scannedImages.length > 0) {
      // set the img src, so we can view the first scanned image
      setScannedImage(scannedImages[0])
    }
  }

  useEffect(() => {
    // call scanDocument on load
    scanDocument()
  }, []);

  return (
    <Image
      source={{ uri: scannedImage }}
    />
  )
}