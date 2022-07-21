import axios from 'axios'

const request = axios.create({
  // baseURL 必须使用
  baseURL: 'http://localhost:8520/sentinel_client_sale/sales/shop'
})

export default request
