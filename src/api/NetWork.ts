import axios from 'axios';

axios.defaults.baseURL = 'http://127.0.0.1:7001';
axios.defaults.timeout = 50000;
axios.defaults.withCredentials = true;
// Add a request interceptor
axios.interceptors.request.use(function (config) {
    // Do something before request is sent
    config.headers.Authorization = localStorage.getItem('token');
    return config;
}, function (error) {
    // Do something with request error
    return Promise.reject(error);
});

// Add a response interceptor
axios.interceptors.response.use(function (response) {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    return response;
}, function (error) {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    return Promise.reject(error);
});


export default {
    get(url: string, params?: {}): any {
        return new Promise( (resolve, reject) => {
            axios.get(url, { params })
                .then(function (response: any) {
                    resolve(response.data)
                })
                .catch(function (error: any) {
                    reject(error)
                })
        });
    },
    post(url: string, params?: {}): any {
        return new Promise((resolve, reject) => {
            axios.post(url, params)
                .then(function (response: any) {
                    resolve(response.data);
                })
                .catch(function (error: any) {
                    reject(error)
                });
        })
    }
}

