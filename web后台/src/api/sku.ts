import { post } from './http.js'

export const addGoodsSkuApi = (params: any) => post('/goods/addGoodsSku', params)
export const deleteGoodsSkuApi = (params: any) => post('/goods/deleteGoodsSku', params)
export const updateGoodsSkuApi = (params: any) => post('/goods/updateGoodsSku', params)
export const getGoodsSkuApi = (params: any) => post('/goods/getGoodsSku', params)
export const getGoodsSkuListApi = (params: any) => post('/goods/getGoodsSkuList', params)
