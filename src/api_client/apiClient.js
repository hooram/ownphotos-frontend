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

export var serverAddress = process.env.BACKEND_HOST

export var Server = axios.create({
  baseURL: process.env.BACKEND_HOST,
  headers: {
    'Content-Type': 'application/json',
  },
  auth: {
    username: process.env.USERNAME,
    password: process.env.PASSWORD
  },
  timeout: 10000,
});

export default {serverAddress, Server}
