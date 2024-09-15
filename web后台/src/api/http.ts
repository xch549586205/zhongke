// 引入axios
import axios, { type AxiosResponse } from 'axios'
// 引入qs模块，对数据进行序列化
// 引入message模块，toast提示
import { ElMessage } from 'element-plus'
// 引入storage模块，操作token

import router from '@/router'

// 请求超时时间
axios.defaults.timeout = 10000

export const baseURL = 'https://api.daodaosmart.com:8080/platform'
axios.defaults.baseURL = baseURL

// 请求拦截器
axios.interceptors.request.use(
  (config: any) => {
    const token = localStorage.getItem('token')
    token && (config.headers.token = token)
    if (config.method.toUpperCase() === 'POST') {
      config.headers['Content-Type'] = 'application/json;charset=utf-8'
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)
// 响应拦截器
axios.interceptors.response.use(
  (response) => {
    if (response.status === 200) {
      return Promise.resolve(response)
    } else {
      return Promise.reject(response)
    }
  },
  // 服务器状态码不是200的情况
  (error) => {
    if (error.response.status) {
      switch (error.response.status) {
        case 500:
          // ElMessage.error('网错错误，请稍后再试！')
          break
        case 404:
          ElMessage.error('网错错误，请稍后再试！')
          break
        // 其他错误，直接抛出错误提示
        default:
          ElMessage.error(error.response.data.message)
      }
      return Promise.reject(error.response)
    }
  }
)

/**
 * get方法，对应get请求
 * @param {String} url [请求的url地址]
 * @param {Object} params [请求时携带的参数]
 */
export function get(url: string, params: any) {
  return new Promise((resolve, reject) => {
    axios
      .get(url, {
        params: params
      })
      .then((res) => {
        if (res.data.code === 0) {
          resolve(res.data)
        } else {
          ElMessage.error(res.data.msg)
          reject(res.data)
        }
      })
      .catch((err) => {
        ElMessage.error(err.response.data.msg)
        reject({ msg: err.response.data.msg })
      })
  })
}
/**
 * post方法，对应post请求
 * @param {String} url [请求的url地址]
 * @param {Object} params [请求时携带的参数]
 */
export function post(url: string, params: any) {
  return new Promise((resolve, reject) => {
    const res = Object.entries(params).filter(([key, val]) => key !== 'successMessage')
    const filterParams = Object.fromEntries(res)
    axios
      .post(url, filterParams)
      .then((res) => {
        if (res.data.code === 0) {
          params.successMessage && ElMessage.success(res.data.msg)
          resolve(res.data)
        } else {
          if (res.data.code === 10001) {
            ElMessage.error('登录信息失效，请重新登录')
            router.replace('/login')
            return
          }
          ElMessage.error(res.data.msg)
          reject(res.data)
        }
      })
      .catch((err) => {
        if (err.data.code === 10001) {
          ElMessage.error('登录信息失效，请重新登录')
          router.replace('/login')
          return
        }
        ElMessage.error(err.data.msg)
        reject({ msg: err.data.msg })
      })
  })
}
/**
 * get方法，对应get请求,直接在地址后面拼串的形式
 * @param {String} url [请求的url地址]
 * @param {String} params [请求时携带的参数]
 */
export function getDynamicynamic(url: any, params: any) {
  return new Promise((resolve, reject) => {
    const completeUrl = `${url}/${params}`
    axios
      .get(completeUrl, {})
      .then((res) => {
        resolve(res.data)
      })
      .catch((err) => {
        reject(err.data)
      })
  })
}
/**
 * post方法，导出文件
 * @param {String} url [请求的url地址]
 * @param {String} params [请求时携带的参数]
 */
export function getFileUseBlobByPost(url: string, params = {}) {
  return new Promise(
    (resolve: (arg0: AxiosResponse<any, any>) => void, reject: (arg0: any) => void) => {
      axios({
        method: 'post',
        url,
        data: params,
        responseType: 'blob'
      })
        .then((res) => {
          resolve(res)
        })
        .catch((err) => {
          reject(err.data)
        })
    }
  )
}
