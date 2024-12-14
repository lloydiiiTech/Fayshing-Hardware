import { createRouter, createWebHistory } from 'vue-router'
import MPINView from '../views/MPINView.vue'
import HomeView from '../views/HomeView.vue'
import ScannedProductView from '../views/ScannedProductView.vue'
import ManualEncodingView from '../views/ManualEncodingView.vue'
import OrderedProductView from '../views/OrderedProductView.vue'
import PaymentView from '../views/PaymentView.vue'
import ReceiptView from '../views/ReceiptView.vue'
import CustomerName from '../components/CustomerName.vue'

import ProfileView from '../views/ProfileView.vue'

import ForgotMPIN from '../views/ForgotMPIN.vue'



const routes = [
  {
    path: '/',
    name: 'mpin',
    component: MPINView
  },
  {
    path: '/login',
    name: 'mpinn',
    component: MPINView
  },

  {
    path: '/forgot-MPIN',
    name: 'ForgotMPIN',
    component: ForgotMPIN
  },

  {
    path: '/home',
    name: 'home',
    component: HomeView
  },
  {
    path: '/profile', // Expect `salesId` as a param
    name: 'ProfileView',
    component: ProfileView,
  },
  {
    path: '/scanned-product',
    name: 'ScannedProductView',
    component: ScannedProductView
  },
  {
    path: '/manual-encoding',
    name: 'ManualEncodingView',
    component: ManualEncodingView
  },
  {
    path: '/ordered-product',
    name: 'OrderedProductView',
    component: OrderedProductView
  },
  {
    path: '/payment',
    name: 'PaymentView',
    component: PaymentView,
  },
  {
    path: '/receipt', // Expect `salesId` as a param
    name: 'ReceiptView',
    component: ReceiptView,
  },
  
  {
    path: '/customername',
    name: 'CustomerName',
    component: CustomerName
  }
]



const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})


export default router
