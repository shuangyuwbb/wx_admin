/**
 @author: wbb
 @date: 2021/4/10
 @Version: 1.0
 */

import http from './http'
import env from './../../env.js'

export const getUserList = params => http.get(env.DEV_URL + 'admin/user/list', params)

export const updateUser = params => http.post(env.DEV_URL + 'admin/user/update', params)

export const addUser = params => http.post(env.DEV_URL + 'admin/user/add', params)

export const searchUser = params => http.post(env.DEV_URL + 'admin/user/search', params)

export const searchGoods = params => http.get(env.DEV_URL + 'admin/goods/search', params)

export const getCategory1 = () => http.get(env.DEV_URL + 'admin/goods/category/v1')

export const getCategory2 = params => http.get(env.DEV_URL + 'admin/goods/category/v2', params)

export const getGoodsLists = params => http.get(env.DEV_URL + 'admin/goods/lists', params)

export const goodsAdd = params => http.post(env.DEV_URL + 'admin/goods/add', params)

export const getOrders = params => http.get(env.DEV_URL + 'admin/order/list', params)

export const updateOrder = params => http.post(env.DEV_URL + 'admin/order/update', params)

export const login = params => http.post(env.DEV_URL + 'admin/user/login', params)


