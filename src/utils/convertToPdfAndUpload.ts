import RNImageToPdf from 'react-native-image-to-pdf'
import {useFinancial, usePlanning} from '@bluecentury/stores'
import moment from 'moment'

export const convertToPdfAndUpload = async (
  files: string[],
  showToast: Function,
  planning?: boolean,
  navlog?: any,
  setScannedImage?: Function
) => {
  const uploadImgFile = usePlanning.getState().uploadImgFile
  const addFilesInGroup = useFinancial.getState().addFilesInGroup
  const navigationLogDocuments = usePlanning.getState().navigationLogDocuments
  const navigationLogDetails = usePlanning.getState().navigationLogDetails
  const uploadVesselNavigationLogFile = usePlanning.getState().uploadVesselNavigationLogFile
  const getNavigationLogDocuments = usePlanning.getState().getNavigationLogDocuments

  // Remove 'file://' from file link is react-native-image-to-pdf requirement
  const arrayForPdf = files.map(item => {
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

    console.log('IMG_UPLOAD_RES', upload)

    if (typeof upload === 'object' && !planning) {
      const uploadDocs = await addFilesInGroup(upload.path)
      console.log('UPLOAD_DOCS', uploadDocs)
      if (typeof uploadDocs === 'object' && uploadDocs[1] === 200) {
        showToast('File upload successfully.', 'success')
      } else {
        showToast('File upload failed.', 'failed')
      }
    }
    if (typeof upload === 'object' && planning) {
      const description = `${moment().format('YYYY-MM-DD hh:mm:ss')}.pdf`

      const newFile = {
        path: upload.path,
        description,
      }
      let body = {
        fileGroup: {
          files:
            navigationLogDocuments?.length > 0
              ? [...navigationLogDocuments?.map(f => ({id: f.id})), newFile]
              : [newFile],
        },
      }

      if (navigationLogDetails?.fileGroup?.id) {
        body.fileGroup.id = navigationLogDetails?.fileGroup?.id
      }

      const uploadDocs = await uploadVesselNavigationLogFile(navlog?.id, body)
      if (typeof uploadDocs === 'object' && uploadDocs.id) {
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