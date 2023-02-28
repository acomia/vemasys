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

const readNotification = (id: number, read: boolean) => {
  return API.put(`v3/notifications/${id}`, {read})
    .then(response => {
      if (response.status === 200) {
        return response.data
      }

      throw new Error('Notifications read failed')
    })
    .catch(error => {
      console.error('Error: Notification read fetching data ', error)
    })
}

const markAllAsReadNotif = () => {
  return API.post('v3/notifications/mark-all-as-read')
    .then(response => {
      if (response.status === 200) {
        return response.data
      }
      throw new Error('Mark all as read Notifications failed')
    })
    .catch(error => {
      console.error(
        'Error: Mark all as read Notifications fetching data',
        error
      )
    })
}

export {getNotifications, readNotification, markAllAsReadNotif}
