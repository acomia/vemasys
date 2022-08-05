import {useEntity, useAuth} from '@bluecentury/stores'

export const resetAllStates = async () => {
  useEntity.getState().reset()
}
