import RNImageToPdf from 'react-native-image-to-pdf'
import {useFinancial, usePlanning, useTechnical} from '@bluecentury/stores'
import moment from 'moment'

export const convertToPdfAndUpload = async (
  files: string[],
  showToast: (msgText: string, type: string) => void,
  planning?: boolean,
  navlog?: any,
  setScannedImage?: (description: string) => void,
  certificates?: boolean,
  bunkering?: boolean,
  accessLevel?: string
) => {
  const uploadImgFile = usePlanning.getState().uploadImgFile
  const addFinancialScan = useFinancial.getState().addFinancialScan
  const uploadCertificateScannedDoc =
    useTechnical.getState().uploadCertificateScannedDoc
  const uploadNavigationLogFileWithAccessLevel =
    usePlanning.getState().uploadNavigationLogFileWithAccessLevel
  const getNavigationLogDocuments =
    usePlanning.getState().getNavigationLogDocuments
  const addBunkeringScan = useTechnical.getState().addBunkeringScan

  // Remove 'file://' from file link is react-native-image-to-pdf requirement
  const arrayForPdf = files?.map(item => {
    return item.replace('file://', '')
  })

  const name = `PDF${Date.now()}.pdf`

  // This part converts jpg to pdf and send pdf to backend.
  // Upload has two steps
  //  first is file uploading,
  //  second is creation of connection between uploaded file and certain navlog
  try {
    const options = {
      imagePaths: arrayForPdf,
      name,
    }

    const pdf = await RNImageToPdf.createPDFbyImages(options)

    const file = {
      uri: `file://${pdf.filePath}`,
      type: 'application/pdf',
      fileName: name,
    }

    const upload = await uploadImgFile(file)

    if (
      typeof upload === 'object' &&
      !planning &&
      !certificates &&
      !bunkering
    ) {
      const uploadDocs = await addFinancialScan(upload.path)
      if (uploadDocs === 'SUCCESS') {
        showToast('File upload successfully.', 'success')
      } else {
        showToast('File upload failed.', 'failed')
      }
    }
    if (typeof upload === 'object' && !planning && certificates) {
      const uploadDocs = await uploadCertificateScannedDoc(upload.path)
      if (uploadDocs === 'SUCCESS') {
        showToast('File upload successfully.', 'success')
      } else {
        showToast('File upload failed.', 'failed')
      }
    }
    if (typeof upload === 'object' && !planning && bunkering) {
      const uploadDocs = await addBunkeringScan(upload.path)
      if (uploadDocs === 'SUCCESS') {
        showToast('File upload successfully.', 'success')
      } else {
        showToast('File upload failed.', 'failed')
      }
    }
    if (typeof upload === 'object' && planning) {
      const description = `${moment().format('YYYY-MM-DD HH:mm:ss')}.pdf`
      const uploadDocs = await uploadNavigationLogFileWithAccessLevel(
        Number(navlog?.id),
        file,
        accessLevel
      )

      if (Array.isArray(uploadDocs) && uploadDocs[0]?.id) {
        getNavigationLogDocuments(navlog?.id)
        showToast('File upload successfully.', 'success')
        setScannedImage(description)
      } else {
        showToast('File upload failed.', 'failed')
      }
    }
  } catch (e) {
    console.log('PDF_ERROR', e)
  }
}
