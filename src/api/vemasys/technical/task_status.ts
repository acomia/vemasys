import {API} from '../../apiService'

export const updateTaskStatus = async (id: string, status: string) => {
  try {
    const response = await API.put(`v3/tasks/${id}/update_status`, {status})
    return response.data
  } catch (error) {
    console.log('Error updating task status', error)
    return null
  }
}
