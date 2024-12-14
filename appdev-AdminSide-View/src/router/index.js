import { createRouter, createWebHistory } from 'vue-router';
import Login from '../views/LoginView.vue';
import Home from '../views/HomeView.vue';
import Products from '../views/ProductsView.vue';
import Inventory from '../views/InventoryView.vue'; // Import InventoryView
import Users from '../views/UsersView.vue'; // Import UsersView
import AddProducts from '../views/AddProductsView.vue'; // Import AddProductsView
import Sales from '../views/SalesView.vue'; // Import SalesView
import AdminProfile from '../views/AdminProfileView.vue'; // Import AdminProfileView
import AddUsers from '../views/AddUsersView.vue'; // Import AddUsersView
import AddAdmin from '../views/AddAdminView.vue'; // Import AddAdminView
import LoginLayout from '../layouts/LoginLayout.vue'; // Adjust path to import
import MainLayout from '../layouts/MainLayout.vue'; // Import main layout if needed
import GenerateQRCode from '../components/GenerateQRCode.vue';
import Register from '../views//RegisterView.vue';
import VerifiedAccount from '../views/VerifiedAccount.vue';
import AdminForgot from '../views/AdminForgot.vue';
import AdminResetPassword from '../views/AdminResetPassword.vue';

const routes = [
  {
    path: '/',
    component: LoginLayout,
    children: [
      { path: '', component: Login }
    ]
  },

  {
    path: '/reset-password',
    component: LoginLayout,
    children: [
      { path: '', component: AdminResetPassword, name: 'AdminResetPassword' }  // Name this route 'Login'
    ]
  },
  {
    path: '/forgot-password',
    component: LoginLayout,
    children: [
      { path: '', component: AdminForgot, name: 'AdminForgot' }  // Name this route 'Login'
    ]
  },
  {
    path: '/verifyAccount',
    name: 'verifiedAccount',
    component: VerifiedAccount
  },
  {
    path: '/register',
    component: LoginLayout,
    children: [
      { path: '', component: Register, name: 'Register' }  // Name this route 'Register'
    ]
  },
  


  {
    path: '/home',
    component: MainLayout,
    children: [
      { path: '', component: Home, meta: { msg: 'SALE' } }
    ]
  },
  {
    path: '/products',
    component: MainLayout,
    children: [
      { path: '', component: Products, meta: { msg: 'PRODUCT' } }
    ]
  },
  {
    path: '/inventory',
    component: MainLayout,
    children: [
      { path: '', component: Inventory, meta: { msg: 'INVENTORY' } }
    ]
  },
  {
    path: '/users',
    component: MainLayout,
    children: [
      { path: '', component: Users, meta: { msg: 'USERS' } }
    ]
  },
  {
    path: '/addProducts',
    component: MainLayout,
    children: [
      { path: '', component: AddProducts, meta: { msg: 'ADD PRODUCTS' } }
    ]
  },
  {
    path: '/sales',
    component: MainLayout,
    children: [
      { path: '', component: Sales, meta: { msg: 'SALES' } }
    ]
  },
  {
    path: '/adminProfile',
    component: MainLayout,
    children: [
      { path: '', component: AdminProfile, meta: { msg: 'ADMIN PROFILE' } }
    ]
  },
  {
    path: '/addUsers',
    component: MainLayout,
    children: [
      { path: '', component: AddUsers, meta: { msg: 'ADD USERS' } }
    ]
  },
  {
    path: '/addAdmin',
    component: MainLayout,
    children: [
      { path: '', component: AddAdmin, meta: { msg: 'ADD ADMIN' } }
    ]
  },
  {
    path: '/generate-qrcode',
    name: 'GenerateQRCode',
    component: MainLayout,
    children: [
      { path: '', component: GenerateQRCode, meta: { msg: 'QR-CODE' } }
    ]
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
