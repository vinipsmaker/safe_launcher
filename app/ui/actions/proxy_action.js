import ActionTypes from './action_types';
import { showToaster } from './toaster_action';

export const toggleProxy = () => {
  return {
    type: ActionTypes.TOGGLE_PROXY
  }
}

export const setProxy = () => {
  return {
    type: ActionTypes.SET_PROXY
  }
}

export const finishInitialProxySettings = () => {
  return {
    type: ActionTypes.FINISH_INITIAL_PROXY_SETTINGS
  }
}
