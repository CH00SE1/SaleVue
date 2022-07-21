import Vue from 'vue'
import Router from 'vue-router'
// import SaleInfo from '@/components/SaleInfo'
import Login from '../views/login.vue'

Vue.use(Router)

// 路由使用
export default new Router({
  routes: [
    {
      path: '/login',
      name: 'Login',
      component: Login
    }
  ]
})
