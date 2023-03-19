import {Comments} from '@bluecentury/models/Comments'

export type CommentWaitingForUpload = {
  method: string
  routeFrom: string | undefined
  description: string
  imgFile: any[]
  attachedImgs: any[]
  showToast: (text: string, res: string) => void
  commentArg?: Comments
  navlogId?: number
}
