export type BulkCargo = {
  actualAmount: NumberOrNull
  actualTonnage: NumberOrNull
  amount: NumberOrNull
  id: number
  isLoading: boolean
  log: StringOrNull
  tonnage: NumberOrNull
  type: BulkCargoType
}

export type BulkCargoType = {
  adnListItem: StringOrNull
  bulkAttributes: Array<any>
  euralCode: StringOrNull
  hscode: StringOrNull
  id: number
  nameDe: StringOrNull
  nameEn: StringOrNull
  nameFr: StringOrNull
  nameNl: StringOrNull
  ntsCode: NumberOrNull
  ntsName: StringOrNull
}
