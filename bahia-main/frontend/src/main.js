import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import $ from 'jquery';
window.$ = $; // Optional, to make it globally accessible


createApp(App).use(router).mount('#app')
