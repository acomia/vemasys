import {InvoiceStatus} from './InvoiceStatus'

export type Invoice = {
  id: number
  date: Date
  dueDate: Date
  sentAt: Date
  totalAmount: string
  totalAmountIncludingVat: string
  customTotalAmount: string
  freeTextBeforeTable: string
  freeText: string
  remarks: string
  paymentReference: string
  senderReference: string
  receiverReference: string
  paidDate: Date
  charters: [StringOrNull]
  contracts: [StringOrNull]
  incomingStatus: string
  outgoingStatus: string
  exchangeRate: string
  receiverFinancialInformation: {
    id: number
    iban: string
    bic: string
    name: string
    bankName: string
    vat: string
    companyType: string
    client: true
    supplier: true
    address: {
      id: number
      phoneNumber: string
      faxNumber: string
      street: string
      number: string
      port: string
      postalCode: string
      city: string
      country: {
        title: string
        name: string
      }
    }
    email: string
    shippingAgentAuthorizationNumber: string
    invoiceEmail: string
    currency: string
    externalId: string
    language: string
    archived: true
    externallyManaged: true
  }
  receiver: {
    id: number
    name: string
    alias: string
    icon: {
      path: string
    }
    type: {
      id: number
      title: string
    }
  }
  senderFinancialInformation: {
    id: number
    iban: string
    bic: string
    name: string
    bankName: string
    vat: string
    companyType: string
    client: true
    supplier: true
    address: {
      id: number
      phoneNumber: string
      faxNumber: string
      street: string
      number: string
      port: string
      postalCode: string
      city: string
      country: {
        title: string
        name: string
      }
    }
    email: string
    shippingAgentAuthorizationNumber: string
    invoiceEmail: string
    currency: string
    externalId: string
    language: string
    archived: true
    externallyManaged: true
  }
  sender: {
    id: number
    name: string
    alias: string
    icon: {
      path: string
    }
    type: {
      id: number
      title: string
    }
  }
  lines: [
    {
      id: number
      description: string
      quantity: string
      unit: string
      unitPrice: string
      amount: string
      vat: {
        id: number
        title: string
        percent: string
        vatExempt: true
        intraCommunityDelivery: true
        externalId: string
        externallyManaged: true
      }
      deductibleVat: string
      children: [object | null]
      receiverCostType: {
        id: number
        title: string
        remark: string
        viewPoint: number
        costForSemiBruto: true
        externalId: string
        externallyManaged: true
      }
      senderCostType: {
        id: number
        title: string
        remark: string
        viewPoint: number
        costForSemiBruto: true
        externalId: string
        externallyManaged: true
      }
      involvedVessels: [
        {
          id: number
          entity: {
            id: number
            name: string
            alias: string
            icon: {
              path: string
            }
            type: {
              id: number
              title: string
            }
          }
          physicalVessel: {
            id: number
            draught: string
            length: string
            weight: string
            width: string
          }
          lastGeolocation: string
        }
      ]
    }
  ]
  currency: string
  externalId: string
  status: InvoiceStatus
  involvedVessels: [
    {
      id: number
      entity: {
        id: number
        name: string
        alias: string
        icon: {
          path: string
        }
        type: {
          id: number
          title: string
        }
      }
      physicalVessel: {
        id: number
        draught: string
        length: string
        weight: string
        width: string
      }
      lastGeolocation: string
    }
  ]
  externallyManaged: true
}
