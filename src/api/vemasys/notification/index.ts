import {API} from '../../apiService'
import {Notification} from '@bluecentury/models'

const getNotifications = () => {
  return API.get<Notification>('v3/notifications')
    .then(response => {
      if (response.data) {
        return response.data
      } else {
        return []
      }
    })
    .catch(error => {
      console.error('Error: Notification fetching data', error)
      return error
    })
}

export {getNotifications}
