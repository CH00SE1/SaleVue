import axios from 'axios'

const request = axios.create({
  // baseURL 必须使用
  baseURL: 'http://192.168.10.87:8520/sentinel_client_sale/sales/shop'
})

export default request
