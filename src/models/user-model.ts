export type User = {
  id?: number
  firstname?: string
  lastname?: string
  professionalEmail?: string
  birthday?: string
  gender?: boolean
  address?: {
    id: number
    phoneNumber: string
    faxNumber: string
    street: string
    number: string
    postalCode: string
    city: string
    country: {
      id: number
      title: string
      name: string
    }
  }
  icon?: {
    id: number
    path: string
    description: string
  }
  language?: string
  defaultLanguage?: {
    id: number
    shortname: string
    fullname: string
  }
  fileGroup?: {
    files: [
      {
        id: number
        path: string
        description: string
      }
    ]
  }
  entityUsers?: string[]
  email?: string
}

type ExtendUser = {
  mmsi?: string
  identificationDocument?: {
    path: string
    description: string
    uploader: object | null
    type: object | null
  }
  certificateLevel?: string
  username?: string
  enabled?: boolean
  plainPassword?: string
}

export type ExtendedUser = User & ExtendUser
