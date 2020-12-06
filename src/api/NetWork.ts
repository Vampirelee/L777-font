import axios from 'axios';
const CancelToken = axios.CancelToken;
const source = CancelToken.source();

axios.defaults.baseURL = 'http://127.0.0.1:7001';
axios.defaults.timeout = 50000;
axios.defaults.withCredentials = true;
// Add a request interceptor
axios.interceptors.request.use(function (config) {
    // Do something before request is sent
    // config.headers.Authorization = localStorage.getItem('token');

    if (config.url?.startsWith('/api/v1')) {
        const isNext = valideRequest(allRoute, config.url, config.method);
        if (!isNext) {
            config.cancelToken = source.token;
            source.cancel('该用户无此请求权限！');
        }
    }
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

function valideRequest(routeTree:any, path:string='', method:string = ''):boolean {
    const restRequest:any[] = [];
    console.log(path, method);
    restRequest.push(routeTree);
    while (restRequest.length !== 0) {
        let route = restRequest.shift();
        const reg = new RegExp(`^${route.rightsPath}(/[0-9A-Za-z]*)?$`, 'i');
        console.log(reg.test(path), route.rightsPath);
        if ((reg.test(path)) && (route.rightsMethod === method || route.rightsMethod === 'all')) return true;
        if (route.children && route.children.length !== 0) {
            restRequest.push(...route.children);
        }
    }
    return false;
}
function getUserRequest() {
    const userInfo = window.sessionStorage.getItem('userInfo');
    if (!userInfo) return [];
    const routes = JSON.parse(userInfo).rightsTree;
    for (let i = 0; i < routes.length; i++) {
        if (routes[i].rightsType === 'action') {
            return routes[i];
        }
    }
}
const allRoute = getUserRequest();


export default {
    get(url: string, params?: {}): any {
        return new Promise( (resolve, reject) => {
            axios.get(url, { params })
                .then(function (response) {
                    resolve(response)
                })
                .catch(function (error) {
                    reject(error)
                })
        });
    },
    post(url: string, params?: {}): any {
        return new Promise((resolve, reject) => {
            axios.post(url, params)
                .then(function (response) {
                    resolve(response);
                })
                .catch(function (error) {
                    reject(error)
                });
        })
    },
    delete: function (path = '', data = {}) {
        return new Promise(function (resolve, reject) {
            axios.delete(path, { data: data })
                .then(function (response) {
                    resolve(response)
                })
                .catch(function (error) {
                    reject(error)
                })
        })
    },
    put(url: string, params?: {}): any {
        return new Promise((resolve, reject) => {
            axios.put(url, params)
                .then(function (response) {
                    resolve(response);
                })
                .catch(function (error) {
                    reject(error)
                });
        })
    },
}

