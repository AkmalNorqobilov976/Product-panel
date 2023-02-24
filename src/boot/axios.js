import Vue from 'vue'
import axios from 'axios'
import { LoadingBar, QSpinnerFacebook } from 'quasar'
// axios.defaults.withCredentials = true
axios.defaults.baseURL = 'http://94.158.54.194:9092/api/'
axios.defaults.headers = { Accept: 'application/json'}
axios.interceptors.request.use(request => {
    LoadingBar.start({
    });
    return request;
})

axios.interceptors.response.use(response => {
    LoadingBar.stop();
    return response;
}, (error) => {
    LoadingBar.stop();
    return Promise.reject(error);
})
// axios.defaults.timeout = 10000
Vue.prototype.$axios = axios

export  { axios as request }
