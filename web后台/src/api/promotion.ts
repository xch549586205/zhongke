import { post } from './http.js'

export const addCategoryApi = (params: any) => post('/small/addCategory', params)
export const deleteCategoryApi = (params: any) => post('/small/deleteCategory', params)
export const updateCategoryApi = (params: any) => post('/small/updateCategory', params)
export const getCategoryApi = (params: any) => post('/small/getCategory', params)
export const getCategoryListApi = (params: any) => post('/small/getCategoryList', params)
export const addCategoryContentApi = (params: any) => post('/small/addCategoryContent', params)
export const deleteCategoryContentApi = (params: any) =>
  post('/small/deleteCategoryContent', params)
export const getCategoryContentListApi = (params: any) =>
  post('/small/getCategoryContentList', params)
export const getCategoryContentApi = (params: any) => post('/small/getCategoryContent', params)

export const updateCategoryContentApi = (params: any) => post('/small/updateCategoryContent', params)

