//封装操作localStorage本地储存的方法

export const storage = {
  setItem(key, value) {
    localStorage.setItem(key, JSON.stringify(value))
  },
  getItem(key) {
    return localStorage.getItem(key) ? JSON.parse(localStorage.getItem(key)) : null
  },
  removeItem(key) {
    localStorage.removeItem(key)
  }
}
