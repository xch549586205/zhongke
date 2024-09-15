import { post } from './http.js'

export const getUserList = (params = {}) => post('/user/getUserList', params)
export const getAuthorityList = (params = {}) => post('/authority/getAuthorityList', params)
export const addUser = (params = {}) => post('/user/register', params)

export const editUser = (params = {}) => post('/user/setUserInfo', params)
export const deleteUser = (params = {}) => post('/user/deleteUser', params)
export const changePassword = (params = {}) => post('/user/changePassword', params)
