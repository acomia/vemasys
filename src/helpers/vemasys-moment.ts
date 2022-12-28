import moment from 'moment-timezone'

/**
 * Create new date time based on selected timezone
 */

// Default Timezone (set to Europe/Brussels currently)
const DEFAULT_TIMEZONE = 'Europe/Brussels' // TO DO: add to app config

const defaultDatetime = (timezone?: string) =>
  moment.tz(timezone ? timezone : DEFAULT_TIMEZONE).format()

export default {
  defaultDatetime,
}
