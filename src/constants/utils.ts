/* eslint-disable no-bitwise */
import {Charter, Location, NavigationLog} from '@bluecentury/models'
import {
  CHARTER_CONTRACTOR_STATUS_ARCHIVED,
  CHARTER_ORDERER_STATUS_COMPLETED,
  ENTITY_TYPE_EXPLOITATION_GROUP,
  ENTITY_TYPE_EXPLOITATION_VESSEL,
} from './constants'

// todo fix Types
export function formatLocationLabel(location?: GeographicPoint | Location) {
  if (location?.locationName) {
    return `[${location?.locationName}] ${location?.name}`
  }
  return location?.name
}

export function formatBulkTypeLabel(bulkType: any): string {
  let label = bulkType?.nameNl ?? bulkType?.nameEn

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

export function formatNumber(
  value: string | number,
  decimal: number,
  separator: string
) {
  const numberValue = Number(value)
    .toFixed(decimal)
    .replace(/(\d)(?=(\d{3})+(?!\d))/g, `$1${separator}`)

  if (decimal > 0) {
    return convertPeriodToComma(numberValue)
  }

  return numberValue
}

export function convertPeriodToComma(value: string) {
  return value.replace('.', ',')
}

export function convertCommaToPeriod(value: string) {
  return value.replace(',', '.')
}

export function calculateTotalIn(
  navigationlog: NavigationLog
): string | number {
  let totalIn = 0
  if (!navigationlog.cargoType) {
    return totalIn
  }
  if (
    navigationlog.standardContainerCargo &&
    navigationlog.standardContainerCargo.length > 0
  ) {
    totalIn = navigationlog.standardContainerCargo.reduce(
      (accumulator: number, container: {nbIn: NumberOrNull}) => {
        if (typeof container.nbIn === 'number') {
          return accumulator + container.nbIn
        }
        return accumulator
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
      .filter((cargo: {isLoading: boolean}) => cargo.isLoading)
      .reduce((accumulator: number, cargo: {actualTonnage: NumberOrNull}) => {
        if (typeof cargo.actualTonnage === 'number') {
          return accumulator + cargo.actualTonnage
        }

        return accumulator
      }, totalIn)
  }
  return totalIn.toString().replace('.', ',')
}

export function calculateTotalOut(
  navigationlog: NavigationLog
): number | string {
  let totalOut = 0
  if (!navigationlog.cargoType) {
    return totalOut
  }
  if (
    navigationlog.standardContainerCargo &&
    navigationlog.standardContainerCargo.length > 0
  ) {
    totalOut = navigationlog.standardContainerCargo.reduce(
      (accumulator: number, container: {nbOut: NumberOrNull}) => {
        if (typeof container.nbOut === 'number') {
          return accumulator + container.nbOut
        }
        return accumulator
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
      .filter((cargo: {isLoading: boolean}) => !cargo.isLoading)
      .reduce((accumulator: number, cargo: {actualTonnage: NumberOrNull}) => {
        if (typeof cargo.actualTonnage === 'number') {
          return accumulator + cargo.actualTonnage
        }

        return accumulator
      }, totalOut)
  }
  return totalOut.toString().replace('.', ',')
}

export const hasSelectedEntityUserSomePermission = (
  state: any,
  permissions: any[]
) => {
  return permissions.some(permission =>
    hasSelectedEntityUserPermission(state, permission)
  )
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
  const re = /_/g
  return str
    ?.toLowerCase()
    ?.replace(/\b\w/g, s => s.toUpperCase())
    ?.replace(re, ' ')
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
    '#10B981',
  ]
}

export const getCharterStatus = (
  charter: Charter,
  selectedEntityType: string
) => {
  if (
    charter.ordererStatus === CHARTER_ORDERER_STATUS_COMPLETED &&
    charter.contractorStatus !== CHARTER_CONTRACTOR_STATUS_ARCHIVED
  ) {
    return CHARTER_ORDERER_STATUS_COMPLETED
  }

  if (charter.contractorStatus === CHARTER_CONTRACTOR_STATUS_ARCHIVED) {
    return charter.contractorStatus
  }

  return selectedEntityType === ENTITY_TYPE_EXPLOITATION_VESSEL ||
    selectedEntityType === ENTITY_TYPE_EXPLOITATION_GROUP
    ? charter.contractorStatus
    : charter.ordererStatus
}

export const darkenColor = (hexColor: string, amount: number) => {
  // Remove the '#' symbol from the hexadecimal color
  const color = hexColor.replace('#', '')

  // Convert the hexadecimal color to RGB values
  const red = parseInt(color.substring(0, 2), 16)
  const green = parseInt(color.substring(2, 4), 16)
  const blue = parseInt(color.substring(4, 6), 16)

  // Calculate the darker RGB values
  const darkerRed = Math.round(red * (1 - amount))
  const darkerGreen = Math.round(green * (1 - amount))
  const darkerBlue = Math.round(blue * (1 - amount))

  // Convert the darker RGB values back to hexadecimal
  const darkerHexColor =
    '#' +
    ((1 << 24) + (darkerRed << 16) + (darkerGreen << 8) + darkerBlue)
      .toString(16)
      .slice(1)

  return darkerHexColor
}
