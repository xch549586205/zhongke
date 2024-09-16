import { post } from './http.js'

export const addBannerApi = (params = {}) => post('/small/addBanner', params)
export const getBannerListApi = (params = {}) => post('/small/getBannerList', params)

export const updateBannerApi = (params = {}) => post('/small/updateBanner', params)

export const deleteBannerApi = (params = {}) => post('/small/deleteBanner', params)
