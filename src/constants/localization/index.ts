import {useSettings} from '@bluecentury/stores'
import EN from './en.json'

// create key based on JSON lang and use EN as reference
type Key = keyof typeof EN

export const _t = (key: Key) => {
  const language = useSettings.getState().language
  switch (language) {
    case 'en':
      return EN[key]
    default:
      return EN[key]
  }
}
