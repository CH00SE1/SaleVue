import axios from 'axios'

// 本机地址
let base = 'http://192.168.10.87:8520/sentinel_client_sale'

// 服务器地址
// let base = 'http://192.168.191.210:8520/sentinel_client_sale'

const request = axios.create({
  // baseURL 必须使用
  baseURL: base
})

export default request

export function postRequest (config) {
  const instance = axios.create({
    // 设置基础的url配置项，这样接口处的url前面就不用写url:'http://127.0.0.1:8000/api/home'，直接写成 url:'/api/home', 就可以了
    baseURL: base,
    // 设置请求超时时间
    timeout: 30000
  })
  // 3.发送真正的网络请求
  return instance(config)
}
