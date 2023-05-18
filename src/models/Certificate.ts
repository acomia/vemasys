export type Certificate = {
  id: number
  startDate: Date
  endDate: Date
  name: string
  description: string
  type: {
    id: number
    title: string
  }
  fileGroup: {
    id: number
    files: [
      {
        id: number
        path: string
        description: string
        uploadedTime: Date
        lastModification: Date
        uploader: string
        type: object
      }
    ]
  }
}
