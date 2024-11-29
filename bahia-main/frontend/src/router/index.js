import { createRouter, createWebHistory } from 'vue-router';
import Login from '../views/LoginView.vue';
import Home from '../views/HomeView.vue';
import LoginLayout from '../layouts/LoginLayout.vue'; // Adjust path to import
import MainLayout from '../layouts/MainLayout.vue'; // Import main layout if needed
import Register from '../views//RegisterView.vue';
import VerifiedAccount from '../views/VerifiedAccount.vue';


const routes = [
  {
    path: '/',
    component: LoginLayout,
    children: [
      { path: '', component: Login, name: 'Login' }  // Name this route 'Login'
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
  
  
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
