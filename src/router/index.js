import Vue from 'vue'
import Router from 'vue-router'
import SaleInfo from '@/components/SaleInfo'

Vue.use(Router)

// 路由使用
export default new Router({
  routes: [
    {
      path: '/',
      name: 'SaleInfo',
      component: SaleInfo
    }
  ]
})
