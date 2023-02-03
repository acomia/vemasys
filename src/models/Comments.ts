export type Comments = {
  id: number
  creationDate: string
  creator: {
    id: number
  }
  description: string
  user: {
    firstname: string
    icon: {
      path: string
    }
    id: number
    lastname: string
  }
}
