import { post } from './http.js'

export const searchGoods = (params: any) => post('/goods/searchGoods', params)
