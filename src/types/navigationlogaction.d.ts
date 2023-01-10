type NavigationLogAction = {
  '@id'?: string
  cargoHoldTransactions?: CargoHoldTransaction[]
  end?: Date | string
  estimatedEnd?: Date | string
  id?: string
  navigationBulk?: NavigationBulk
  navigationLog?: any
  start?: Date | string
  storageUnitTransactions?: any
  type?: string
  value?: string
  parent?: NavigationLogAction
  children?: NavigationLogAction[]
  cargoHoldActions?: any
}
