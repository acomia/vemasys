import {Platform} from 'react-native'

export function formatLocationLabel(location: GeographicPoint) {
  if (location?.locationName) {
    return `[${location?.locationName}] ${location?.name}`
  }
  return location?.name
}

export function formatBulkTypeLabel(bulkType: any): string {
  let label = bulkType.nameNl ?? bulkType.nameEn

  if (bulkType.hscode) {
    label = `${bulkType.hscode} - ${label}`
  }

  if (bulkType.euralCode) {
    label = `[EURAL ${bulkType.euralCode}] ${label}`
  }

  if (bulkType.adnListItem) {
    label = `[UN ${bulkType.adnListItem.unNumber}] ${label}`
  }

  return label
}

export function formatNumber(value: string | number, decimal: number) {
  return Platform.OS === 'ios'
    ? Number(value).toLocaleString('en-GB', {
        maximumFractionDigits: decimal,
        minimumFractionDigits: decimal
      })
    : Number(value)
        .toFixed(decimal)
        .replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
}

export function calculateTotalIn(navigationlog: any): number {
  let totalIn = 0
  if (!navigationlog.cargoType) {
    return totalIn
  }
  if (
    navigationlog.standardContainerCargo &&
    navigationlog.standardContainerCargo.length > 0
  ) {
    totalIn = navigationlog.standardContainerCargo.reduce(
      (accumulator: number, container: {nbIn: string}) => {
        if (typeof container.nbIn === 'string') {
          return accumulator + parseInt(container.nbIn)
        }
        return accumulator + container.nbIn
      },
      totalIn
    )
  } else if (
    navigationlog.loadedContainerCargo &&
    navigationlog.loadedContainerCargo.length > 0
  ) {
    totalIn = navigationlog.loadedContainerCargo.length
  } else if (navigationlog.bulkCargo && navigationlog.bulkCargo.length > 0) {
    totalIn = navigationlog.bulkCargo
      .filter((cargo: {isLoading: any}) => cargo.isLoading)
      .reduce((accumulator: number, cargo: {tonnage: string}) => {
        if (typeof cargo.tonnage === 'string') {
          return accumulator + parseFloat(cargo.tonnage)
        }

        return accumulator + cargo.tonnage
      }, totalIn)
  }
  return totalIn
}

export function calculateTotalOut(navigationlog: any): number {
  let totalOut = 0
  if (!navigationlog.cargoType) {
    return totalOut
  }
  if (
    navigationlog.standardContainerCargo &&
    navigationlog.standardContainerCargo.length > 0
  ) {
    totalOut = navigationlog.standardContainerCargo.reduce(
      (accumulator: number, container: {nbOut: string}) => {
        if (typeof container.nbOut === 'string') {
          return accumulator + parseInt(container.nbOut)
        }
        return accumulator + container.nbOut
      },
      totalOut
    )
  } else if (
    navigationlog.unloadedContainerCargo &&
    navigationlog.unloadedContainerCargo.length > 0
  ) {
    totalOut = navigationlog.unloadedContainerCargo.length
  } else if (navigationlog.bulkCargo && navigationlog.bulkCargo.length > 0) {
    totalOut = navigationlog.bulkCargo
      .filter((cargo: {isLoading: any}) => !cargo.isLoading)
      .reduce((accumulator: number, cargo: {tonnage: string}) => {
        if (typeof cargo.tonnage === 'string') {
          return accumulator + parseFloat(cargo.tonnage)
        }

        return accumulator + cargo.tonnage
      }, totalOut)
  }
  return totalOut
}

export const hasSelectedEntityUserPermission = (
  entity: any,
  permission: string
) => {
  if (!entity) {
    return false
  }

  if (!entity.role) {
    return false
  }

  if (!entity.role.permissions || entity.role.permissions.length === 0) {
    return false
  }

  return entity.role.permissions.includes(permission)
}

export const titleCase = (str: string) => {
  return str.toLowerCase().replace(/\b\w/g, s => s.toUpperCase())
}

export const formatConsumableLabel = (consumable: Consumable) => {
  if (consumable.brand && consumable.brand.title) {
    return `${consumable.brand.title}: ${consumable.name}`
  }

  return consumable.name
}

export function getAvailableColors(): string[] {
  return [
    '#A0AEC0',
    '#F56565',
    '#ED8936',
    '#ECC94B',
    '#667EEA',
    '#ED64A6',
    '#81E6D9',
    '#10B981'
  ]
}
