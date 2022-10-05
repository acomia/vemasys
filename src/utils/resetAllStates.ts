import {useEntity, useAuth, useMap} from '@bluecentury/stores'

export const resetAllStates = async () => {
  useEntity.getState().reset()
  useMap.getState().reset()
}
