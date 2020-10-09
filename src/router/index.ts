import Vue from 'vue'
import VueRouter, { RouteConfig } from 'vue-router'
const Register = () => import('@/views/Register.vue');
const Login = () => import('@/views/Login.vue');
const Admin = () => import('@/views/Admin.vue');

Vue.use(VueRouter);

const routes: Array<RouteConfig> = [
  {
    path: '/register',
    name: 'Register',
    component: Register
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/admin',
    name: 'Admin',
    component: Admin
  },

];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
});

// 路由守卫
router.beforeEach((to, from, next) => {
  if (to.path === '/login' || to.path === '/register') return next();

  const token = localStorage.getItem('token');
  if (!token)  return next( {path: '/login'} );
  next()

});

export default router
