import axios from "axios";

// https://axios-http.com/docs/config_defaults
const instance = axios.create({
    baseURL: 'http://localhost:5353/',
    withCredentials: true,
  });

export default instance;
