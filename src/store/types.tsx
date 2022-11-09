export const ADD_NOTIFICATION: string = "ADD_NOTIFICATION";
export const APP_LOAD: string = "APP_LOAD";
export const GET_GSTS: string = "GET_GSTS";
export const LOGIN: string = "LOGIN";
export const LOGOUT: string = "LOGOUT";
export const REMOVE_NOTIFICATION: string = "REMOVE_NOTIFICATION";
export const UPDATE_COMMON: string = "UPDATE_COMMON";
export const TOKEN_PRESENT: string = "TOKEN_PRESENT";
export const ADD_GST: string = "ADD_GST";

export interface NotificationAction {
  payload: any;
  type: string;
}

export interface UserAction {
  type: string;
  payload: any;
}
