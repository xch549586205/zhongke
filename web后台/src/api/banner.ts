import { post } from './http.js'

export const addBannerApi = (params = {}) => post('/small/addBanner', params)
export const getBannerListApi = (params = {}) => post('/small/getBannerList', params)
