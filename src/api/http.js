/**
 @author: wbb
 @date: 2021/4/10
 @Version: 1.0
 */
import axios from 'axios'
// import env from '../constants/env'


// axios.defaults.withCredentials = true
// axios.withCredentials = true
var service = axios.create({
    baseURL: '',
    timeout: 10000
})

service.interceptors.request.use(function (request) {
    // store.commit('changeRateLoading', true)
    return request
})

service.interceptors.response.use(function (response) {
    const {status} = response.data
    if (Object.is(status, 0)) {
        return response.data.data
    } else if (Object.is(status, 200)) {
        return response.data
    } else if (Object.is(status, undefined)) {
        return response.data
    } else if (Object.is(status, -466)) { // 游客点评特殊处理
        return response.data
    }else{
        return response.data.data
    }
}, function (error) {

    return Promise.reject(error)
})

class http {
    static async get(url, params) {
        let res = await service.get(url, {params})
        return res
    }

    static async post(url, params) {
        let res = await service.post(url, params)
        return res
    }
}

export default http
