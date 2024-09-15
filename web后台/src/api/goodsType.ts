import { post } from './http.js'

export const addGoodsTypeApi = (params: any) => post('/goods/addGoodsType', params)
export const getGoodsTypeListApi = (params: any) => post('/goods/getGoodsTypeList', params)
