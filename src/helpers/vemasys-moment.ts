import moment from 'moment-timezone'

/**
 * Create new date time based on selected timezone
 */

// Default Timezone (set to Europe/Brussels currently)
const DEFAULT_TIMEZONE = 'Europe/Brussels' // TO DO: add to app config

/**
 * Equivalent to new Date() but in formatted timezone
 * @param timezone (Optional) timezone
 * @returns string
 */
const defaultDatetime = (timezone?: string) =>
  moment.tz(timezone ? timezone : DEFAULT_TIMEZONE).format()

/**
 * Format's the date in timezone format
 * @param date selected date
 * @param timezone timezone to format to otherwise use default timezone set
 * @returns string
 */
const formatDate = (date: Date, timezone?: string) =>
  moment.tz(date.toUTCString(), timezone ? timezone : DEFAULT_TIMEZONE).format()

export default {
  defaultDatetime,
  formatDate,
}
