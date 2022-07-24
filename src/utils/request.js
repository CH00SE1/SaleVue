import axios from 'axios'

let base = 'http://192.168.10.87:8520/sentinel_client_sale'

const request = axios.create({
  // baseURL 必须使用
  baseURL: base
})

export default request

// 传递json格式的post请求
export const postRequest = (url, params) => {
  return axios({
    method: 'post',
    url: `${base}${url}`,
    headers: {'Content-Type': 'application/json'},
    data: params
  })
}
