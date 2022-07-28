import camelcaseKeys from 'camelcase-keys'

export const onSuccessfulResponse = async (response: any) => {
  if (response.data) {
    response.data = camelcaseKeys(response.data, {deep: true})
  }
  return response
}
