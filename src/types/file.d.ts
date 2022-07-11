enum FileType {
  FILE_TYPE_PDF = 'application/pdf',
  FILE_TYPE_JPEG = 'image/jpeg'
}

type File = {
  '@id'?: string
  description?: string
  id?: string
  path: string
}
