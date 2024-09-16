import { post } from './http.js'

export const addCategoryApi = (params: any) => post('/small/addCategory', params)
export const deleteCategoryApi = (params: any) => post('/small/deleteCategory', params)
export const updateCategoryApi = (params: any) => post('/small/updateCategory', params)
export const getCategoryApi = (params: any) => post('/small/getCategory', params)
export const getCategoryListApi = (params: any) => post('/small/getCategoryList', params)
