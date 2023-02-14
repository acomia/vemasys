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
    outgoingStatus: out_status,
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

const uploadFinancialFile = async (filePath: string) => {
  const entityUsers = useEntity.getState().entityUsers
  const entityUserId = useEntity.getState().entityUserId
  const fileGroupId = entityUsers.find(item => item.id === entityUserId)?.entity
    .fileGroup.id
  return API.put(`add_file_to_file_group/${fileGroupId}`, {
    path: filePath,
    description: `Invoice scan ${Date.now()}.pdf`,
  })
    .then(response => {
      console.log('FIN_UPLOADING', response.data)
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

const addFinancialScan = async (filePath: string) => {
  const entityId = useEntity.getState().entityId
  console.log('ADD_FINANCIAL_SCAN_STARTED')
  return API.post(`v3/Entity/${entityId}/files`, {
    path: filePath,
    description: `Invoice scan ${Date.now()}.pdf`,
    uploader: useEntity.getState().user?.id,
    type: {
      title: 'mobile upload',
      relevance: 'financial',
    },
  })
    .then(response => {
      console.log('ADD_FINANCIAL_SCAN_SUCCESS', response)
      return Promise.resolve(response.data.id ? 'SUCCESS' : 'FAILED')
    })
    .catch(error => {
      console.error('Error: Invoice details data', error)
      return Promise.reject('')
    })
}

const getFinancialFile = async (id: string) => {
  return API.get(`file_groups/${id}`)
    .then(response => {
      console.log('FILES_FROM_GROUP', response)
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
  updateInvoiceStatus,
  uploadFinancialFile,
  getFinancialFile,
  addFinancialScan,
}
