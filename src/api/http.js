/**
 @author: wbb
 @date: 2021/4/10
 @Version: 1.0
 */
import axios from 'axios'
import {Message} from 'element-ui'

// axios.defaults.withCredentials = true
// axios.withCredentials = true
var service = axios.create({
    baseURL: '',
    timeout: 10000
})

axios.interceptors.request.use(config => {
    // 在最后必须return config
    config.headers.Authorization = window.sessionStorage.getItem('token')
    return config
})
service.interceptors.response.use(function (response) {
    const {status} = response.data
    if (Object.is(status, 0)) {
        if(response.data.msg) Message.success(response.data.msg)
        return response.data.data
    } else if (Object.is(status, -1)) {
        if(response.data.msg) Message.error(response.data.msg)
        return response.data
    } else if (Object.is(status, undefined)) {
        return response.data
    } else if (Object.is(status, -466)) {
        return response.data
    }else{
        return response.data.data
    }
}, function (error) {

    return Promise.reject(error)
})

class http {
    static async get(url, params) {
        return await service.get(url, {params})
    }

    static async post(url, params) {
        return await service.post(url, params)
    }
}

export default http
