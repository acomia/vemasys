import {API} from '@bluecentury/api/apiService'
import {useEntity} from '@bluecentury/stores'
import moment from 'moment'

const reloadInvoiceStatistics = async (year: string) => {
  const entityId = useEntity.getState().entityId
  return API.get(`entities/${entityId}/financial_details?year=${year}`)
    .then(response => {
      if (response.data) {
        return response.data
      } else {
        throw new Error('Invoice statistics failed.')
      }
    })
    .catch(error => {
      console.error('Error: Invoice statistics data', error)
    })
}

const reloadInvoices = async (
  viewPoint: string,
  year: string,
  page: number
) => {
  const startDate = moment(year).startOf('month').format('YYYY-MM-DD')
  const endDate = moment(startDate).endOf('year').format('YYYY-MM-DD')
  return API.get(
    `invoices?viewPoint=${viewPoint}&date[after]=${startDate}&date[before]=${endDate}&order[date]=desc&page=${page}`
  )
    .then(response => {
      if (response.data) {
        return response.data
      } else {
        throw new Error('Incoming invoices failed.')
      }
    })
    .catch(error => {
      console.error('Error: Incoming invoices data', error)
    })
}

const getInvoiceDetails = async (id: string) => {
  return API.get(`invoices/${id}`)
    .then(response => {
      if (response.data) {
        return response.data
      } else {
        throw new Error('Invoice details failed.')
      }
    })
    .catch(error => {
      console.error('Error: Invoice details data', error)
    })
}

const updateInvoiceStatus = async (
  id: string,
  in_status: string,
  out_status: string
) => {
  return API.put(`invoices/${id}`, {
    status: in_status,
    outgoingStatus: out_status
  })
    .then(response => {
      if (response.data) {
        return response.data
      } else {
        throw new Error('Invoice details failed.')
      }
    })
    .catch(error => {
      console.error('Error: Invoice details data', error)
    })
}

export {
  reloadInvoiceStatistics,
  reloadInvoices,
  getInvoiceDetails,
  updateInvoiceStatus
}
