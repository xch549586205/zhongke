import { post } from './http.js'

export const addGoodsApi = (params: any) => post('/goods/addGoods', params)
export const searchGoodsApi = (params: any) => post('/goods/searchGoods', params)
export const deleteGoodsApi = (params: any) => post('/goods/deleteGoods', params)

//商品标签
export const getGoodsTagListApi = (params: any) => post('/goods/getGoodsTagList', params)
export const addGoodsTagApi = (params: any) => post('/goods/addGoodsTag', params)
export const updateGoodsTagApi = (params: any) => post('/goods/updateGoodsTag', params)
export const deleteGoodsTagApi = (params: any) => post('/goods/deleteGoodsTag', params)

export const getGoodsByIdApi = (params: any) => post('/goods/getGoodsById', params)
export const updateGoodsApi = (params: any) => post('/goods/updateGoods', params)
export const updateGoodsStateApi = (params: any) => post('/goods/updateGoodsState', params)
export const getGoodsNumApi = (params: any) => post('/goods/getGoodsNum', params)
export const copyGoodsApi = (params: any) => post('/goods/copyGoods', params)
