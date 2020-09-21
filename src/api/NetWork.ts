import axios from 'axios';

axios.defaults.baseURL = 'http://127.0.0.1:7001';
axios.defaults.timeout = 5000;
axios.defaults.withCredentials = true;



export default {
    get(url: string, params: {}): any {
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
    post(url: string, params: {}): any {
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

