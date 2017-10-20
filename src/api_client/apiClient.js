import axios from "axios";

import store from '../store'
store.subscribe(listener)

function select(state) {
  return state.auth.jwtToken
}

function listener() {
  let token = select(store.getState())
  axios.defaults.headers.common['Authorization'] = token;
}

export var serverAddress = process.env.REACT_APP_BACKEND_HOST;

export var Server = axios.create({
  baseURL: process.env.REACT_APP_BACKEND_HOST+'/api/',
  headers: {
    'Content-Type': 'application/json',
  },
  auth: {
    username: process.env.REACT_APP_ADMIN_USERNAME,
    password: process.env.REACT_APP_ADMIN_PASSWORD
  },
  timeout: 10000,
});

export default {serverAddress, Server}
