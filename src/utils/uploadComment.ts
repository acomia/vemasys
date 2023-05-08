import {useEntity, usePlanning, useSettings} from '@bluecentury/stores'
import {PROD_URL, UAT_URL} from '@vemasys/env'
import {Comments} from '@bluecentury/models'

export const uploadComment = async (
  methodArg: string,
  routeFromArg: string | undefined,
  descriptionArg: string,
  imgFileArg: any[],
  attachedImgsArg: string[],
  showToast: (text: string, res: string) => void,
  commentArg?: Comments,
  navlogId?: number,
  accessLevel: string
) => {
  const navigationLogDetails = usePlanning.getState().navigationLogDetails
  const uploadImgFile = usePlanning.getState().uploadImgFile
  const updateComment = usePlanning.getState().updateComment
  const getNavigationLogComments =
    usePlanning.getState().getNavigationLogComments
  const createNavlogComment = usePlanning.getState().createNavlogComment
  const isOnline = useSettings.getState().isOnline
  const currentEnv = useSettings.getState().env
  const user = useEntity.getState().user
  const setCommentsWaitingForUpload =
    useEntity.getState().setCommentsWaitingForUpload
  const setRejectedComments = useEntity.getState().setRejectedComments

  const uploadEndpoint = () => {
    if (currentEnv === 'PROD') {
      return PROD_URL
    }
    if (currentEnv === 'UAT') {
      return UAT_URL
    }
  }

  const newCommentWaitingForUpload = {
    method: methodArg,
    routeFrom: routeFromArg,
    description: descriptionArg,
    imgFile: imgFileArg,
    attachedImgs: attachedImgsArg,
    showToast: showToast,
    comment: commentArg,
    navlogId: navlogId,
  }

  if (!isOnline) {
    setCommentsWaitingForUpload(newCommentWaitingForUpload)
    showToast('Comment added to uploading queue.', 'success')
    return
  }
  let res
  let tempComment = ''
  if (methodArg === 'edit' && commentArg) {
    if (routeFromArg === 'Planning') {
      if (attachedImgsArg.length > 0) {
        attachedImgsArg.forEach(item => {
          tempComment = tempComment + '-' + '\n' + `<img src='${item}' />`
        })
      }
      if (imgFileArg.length > 0) {
        await Promise.all(
          imgFileArg.map(async (file: any) => {
            const upload = await uploadImgFile(file)
            if (typeof upload === 'object') {
              tempComment =
                tempComment +
                '-' +
                '\n' +
                `<img src='${uploadEndpoint()}upload/documents/${
                  upload.path
                }' />`
            }
          })
        )
      }
      res = await updateComment(
        commentArg.id.toString(),
        descriptionArg + tempComment,
        accessLevel
      )
      if (typeof res === 'object') {
        showToast('Comment updated.', 'success')
        getNavigationLogComments(navigationLogDetails?.id)
      } else {
        showToast('Comment update failed.', 'failed')
      }
    } else if (routeFromArg === 'Technical') {
    }
  } else {
    if (routeFromArg === 'Planning') {
      if (imgFileArg.length > 0) {
        await Promise.all(
          imgFileArg.map(async (file: any) => {
            const upload = await uploadImgFile(file)
            if (typeof upload === 'object') {
              tempComment =
                tempComment +
                '-' +
                '\n' +
                `<img src='${uploadEndpoint()}upload/documents/${
                  upload.path
                }' />`
            }
          })
        )
        const response = await createNavlogComment(
          navlogId,
          descriptionArg + tempComment,
          user?.id,
          accessLevel
        )
        if (typeof response === 'object') {
          showToast('New comment added.', 'success')
          getNavigationLogComments(navigationLogDetails?.id)
        } else {
          showToast('New comment failed.', 'failed')
          setRejectedComments(newCommentWaitingForUpload)
        }
      } else {
        res = await createNavlogComment(
          navlogId,
          descriptionArg,
          user?.id,
          accessLevel
        )
        if (typeof res === 'object') {
          showToast('New comment added.', 'success')
          getNavigationLogComments(navigationLogDetails?.id)
        } else {
          showToast('New comment failed.', 'failed')
          setRejectedComments(newCommentWaitingForUpload)
        }
      }
    } else if (routeFromArg === 'Technical') {
    }
  }
}
