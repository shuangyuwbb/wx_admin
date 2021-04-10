/**
 @author: wbb
 @date: 2021/4/10
 @Version: 1.0
 */

import http from './http'
import env from './../../env.js'

export const getUserList = params => http.get(env.DEV_URL + 'admin/user', params)

export const updateUser = params => http.post(env.DEV_URL + 'admin/update', params)

export const addUser = params => http.get(env.DEV_URL + 'add/user', params)

export const searchUser = params => http.get(env.DEV_URL + 'search/user', params)

export const searchGoods = params => http.get(env.DEV_URL + 'search/user', params)


