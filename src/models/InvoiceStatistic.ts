export type InvoiceStatistic = {
  entityName: string
  paidIncoming: number
  unpaidIncoming: number
  totalIncoming: number
  paidOutgoing: number
  unpaidOutgoing: number
  totalOutgoing: number
  balance: number
  average: number
  navigated_days: {
    days: number
  }
}
