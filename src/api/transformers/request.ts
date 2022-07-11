import {RequestTransform} from 'apisauce'
// import snakeCaseKeys from 'snakecase-keys'

export const paramsToSnakeCase: RequestTransform = request => {
  // if (request.params) {
  //   request.params = snakeCaseKeys(request.params)
  // } else {
  //   if (request.data instanceof FormData === false) {
  //     request.data = snakeCaseKeys(request.data)
  //   }
  // }
  console.log('API Request: ', request)
}
