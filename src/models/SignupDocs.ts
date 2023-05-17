export type SignupDocs = {
  icon: {
    path: string
    description: string
    uploader: object | null
    type: object | null
  }
  identificationDocument: {
    path: string
    description: string
    uploader: object | null
    type: object | null
  }
  tonnageCertificate: {
    path: string
    description: string
    uploader: string
    type: {
      title: string
      relevance: string
    }
  }
}
