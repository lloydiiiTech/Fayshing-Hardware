import { createRouter, createWebHistory } from 'vue-router'
import MPINView from '../views/MPINView.vue'
import HomeView from '../views/HomeView.vue'
import ScannedProductView from '../views/ScannedProductView.vue'
import ManualEncodingView from '../views/ManualEncodingView.vue'
import OrderedProductView from '../views/OrderedProductView.vue'
import PaymentView from '../views/PaymentView.vue'
import ReceiptView from '../views/ReceiptView.vue'
import CustomerName from '../components/CustomerName.vue'



const routes = [
  {
    path: '/',
    name: 'mpin',
    component: MPINView
  },
  {
    path: '/home',
    name: 'home',
    component: HomeView
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
    component: PaymentView
  },
  {
    path: '/receipt',
    name: 'ReceiptView',
    component: ReceiptView
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
