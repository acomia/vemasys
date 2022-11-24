type NavigationLogAction = {
  '@id'?: string
  cargoHoldTransactions?: CargoHoldTransaction[]
  end?: Date
  estimatedEnd?: Date
  id?: string
  navigationBulk?: NavigationBulk
  navigationLog?: any
  start?: Date
  storageUnitTransactions?: any
  type?: string
  value?: string
  parent?: NavigationLogAction
  children?: NavigationLogAction[]
  cargoHoldActions?: any
}
