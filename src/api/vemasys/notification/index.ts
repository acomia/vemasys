import {API} from '../../apiService'
import {TNotification} from '@bluecentury/api/models'

const getNotifications = () => {
  return API.get<TNotification>('v3/notifications')
    .then(response => {
      if (response.data) {
        return response.data
      } else {
        throw new Error('Notification failed.')
      }
    })
    .catch(error => {
      console.error('Error: Notification fetching data', error)
    })
}

export {getNotifications}
