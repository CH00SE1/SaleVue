import Vue from 'vue'
import Router from 'vue-router'
// import SaleInfo from '@/components/SaleInfo'
import Login from '../views/login.vue'
import Index from '../views/index.vue'
import day from '../views/day.vue'
import yesterday from '../views/yesterday.vue'
import month from '../views/month.vue'
import lastmonth from '../views/lastmonth.vue'
import year from '../views/year.vue'
import hsInfo from '../views/hsInfo.vue'
import mac from '../views/mac.vue'
import usemac from '../views/usemac.vue'
import sale from '../views/sale.vue'
import pendingOrder from '../views/pendingOrder.vue'

Vue.use(Router)

// 路由使用
export default new Router({
  routes: [
    {
      path: '/',
      name: 'Login',
      component: Login
    }, {
      path: '/index',
      name: 'Index',
      component: Index
    }, {
      path: '/day',
      name: 'day',
      component: day
    }, {
      path: '/yesterday',
      name: 'yesterday',
      component: yesterday
    }, {
      path: '/month',
      name: 'month',
      component: month
    }, {
      path: '/lastmonth',
      name: 'lastmonth',
      component: lastmonth
    }, {
      path: '/year',
      name: 'year',
      component: year
    }, {
      path: '/hsInfo',
      name: 'hsInfo',
      component: hsInfo
    }, {
      path: '/mac',
      name: 'mac',
      component: mac
    }, {
      path: '/usemac',
      name: 'usemac',
      component: usemac
    }, {
      path: '/sale',
      name: 'sale',
      component: sale
    }, {
      path: '/pengingOrder',
      name: 'pengdingOrder',
      component: pendingOrder
    }
  ]
})
