import { post } from './http.js'

export const getAuthorityList = (params: any) => post('/authority/getAuthorityList', params)
