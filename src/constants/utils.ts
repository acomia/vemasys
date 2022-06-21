export function formatLocationLabel(location: GeographicPoint) {
  if (location.locationName) {
    return `[${location.locationName}] ${location.name}`
  }
  return location.name
}
