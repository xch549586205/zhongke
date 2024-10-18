import { post } from './http.js'

export const addGoodsTypeApi = (params: any) => post('/goods/addGoodsType', params)
export const getGoodsTypeListApi = (params: any) => post('/goods/getGoodsTypeList', params)
export const deleteGoodsTypeApi = (params: any) => post('/goods/deleteGoodsType', params)
export const updateGoodsTypeApi = (params: any) => post('/goods/updateGoodsType', params)
