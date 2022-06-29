import {Platform} from 'react-native'

export function formatLocationLabel(location: GeographicPoint) {
  if (location.locationName) {
    return `[${location.locationName}] ${location.name}`
  }
  return location.name
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
