const ActionTypes = {
  TOAST_NETWORK_STATUS: 'TOAST_NETWORK_STATUS',
  RETRYING_NETWORK: 'RETRYING_NETWORK',
  SET_NETWORK_DISCONNECTED: 'SET_NETWORK_DISCONNECTED',
  SET_NETWORK_CONNECTED: 'SET_NETWORK_CONNECTED',
  SET_NETWORK_CONNECTING: 'SET_NETWORK_CONNECTING',
  SET_PROXY: 'SET_PROXY',
  TOGGLE_PROXY: 'TOGGLE_PROXY',
  FINISH_INITIAL_PROXY_SETTINGS: 'FINISH_INITIAL_PROXY_SETTINGS',
  AUTH_PROCESSING: 'AUTH_PROCESSING',
  AUTH_CANCEL: 'AUTH_CANCEL',
  LOGIN_SUCCESS: 'LOGIN_SUCCESS',
  LOGIN_ERROR: 'LOGIN_ERROR',
  REGISTER_SUCCESS: 'REGISTER_SUCCESS',
  REGISTER_ERROR: 'REGISTER_ERROR',
  REGISTER_STATE_NEXT: 'REGISTER_STATE_NEXT',
  REGISTER_STATE_BACK: 'REGISTER_STATE_BACK',
  SET_REGISTER_STATE: 'SET_REGISTER_STATE',
  LOGOUT: 'LOGOUT',
  RESET_USER: 'RESET_USER',
  SHOW_APP_DETAIL_PAGE: 'SHOW_APP_DETAIL_PAGE',
  HIDE_APP_DETAIL_PAGE: 'HIDE_APP_DETAIL_PAGE',
  SHOW_AUTH_REQUEST: 'SHOW_AUTH_REQUEST',
  HIDE_AUTH_REQUEST: 'HIDE_AUTH_REQUEST',
  SHOW_NEXT_AUTH_REQUEST: 'SHOW_NEXT_AUTH_REQUEST',
  ADD_APPLICATION: 'ADD_APPLICATION',
  REVOKE_APPLICATION: 'REVOKE_APPLICATION',
  ADD_ACTIVITY: 'ADD_ACTIVITY',
  UPDATE_ACTIVITY: 'UPDATE_ACTIVITY',
  UPDATE_ACTIVITY: 'UPDATE_ACTIVITY',
  SET_LOGS_FILTER: 'SET_LOGS_FILTER',
  RESET_LOGS_FILTER: 'RESET_LOGS_FILTER',
  SET_DOWNLOAD_DATA: 'SET_DOWNLOAD_DATA',
  SET_UPLOAD_DATA: 'SET_UPLOAD_DATA',
  SET_UNAUTH_STATE_DATA: 'SET_UNAUTH_STATE_DATA',
  SET_AUTH_STATE_DATA: 'SET_AUTH_STATE_DATA',
  SET_DASH_GET_COUNT: 'SET_DASH_GET_COUNT',
  SET_DASH_POST_COUNT: 'SET_DASH_POST_COUNT',
  SET_DASH_DELETE_COUNT: 'SET_DASH_DELETE_COUNT',
  SET_DASH_PUT_COUNT: 'SET_DASH_PUT_COUNT',
  FETCHING_ACCOUNT_STORAGE: 'FETCHING_ACCOUNT_STORAGE',
  UPDATE_ACCOUNT_STORAGE: 'UPDATE_ACCOUNT_STORAGE',
  DEC_ACCOUNT_UPDATE_TIMEOUT: 'DEC_ACCOUNT_UPDATE_TIMEOUT',
  SET_LAST_UPDATE_FROM_NOW : 'SET_LAST_UPDATE_FROM_NOW',
  SHOW_TOASTER : 'SHOW_TOASTER',
  SHOW_NEXT_TOASTER : 'SHOW_NEXT_TOASTER',
  HIDE_TOASTER : 'HIDE_TOASTER'
};

export default ActionTypes;
