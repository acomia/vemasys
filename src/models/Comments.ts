export type Comments = {
  id: number
  creationDate: string
  creator: {
    id: number
    user: {
      id: number
      firstname: string
      lastname: string
      icon: {
        id: number
        path: string
        description: string
        uploadedTime: Date
        lastModification: Date
        uploader: object
        type: object
      }
    }
  }
  description: string
  // user: {
  //   firstname: string
  //   icon: {
  //     path: string
  //   }
  //   id: number
  //   lastname: string
  // }
  accessLevel: string
}
