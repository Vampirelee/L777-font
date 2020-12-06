import Vue from 'vue'
import VueRouter, { RouteConfig } from 'vue-router'
import Cookies from "js-cookie";
const Register = () => import('@/views/Register.vue');
const Login = () => import('@/views/Login.vue');
const Admin = () => import('@/views/Admin.vue');
const Home = () => import('@/views/Home.vue');
const Right = () => import('@/components/admin/Right.vue');
const Roles = () => import('@/components/admin/Roles.vue');
const Users = () => import('@/components/admin/Users.vue');
const Welcome = () => import('@/components/admin/Welcome.vue');

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
    redirect: '/welcome',
    component: Admin,
    children: [
      { path: '/welcome', component: Welcome},
      { path: '/right', component: Right},
      { path: '/roles', component: Roles},
      { path: '/users', component: Users},
    ]
  },
  {
    path: '/home',
    name: 'Home',
    component: Home
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
  const token = Cookies.get('token');
  if (!token)  return next( {path: '/login'} );
  const routeTree = getAllRoute();
  const isNext = valideRoute(routeTree, to.path) ||true;
  if (isNext) {
    next();
  } else {
    next(false);
  }

});

function valideRoute(routeTree:any, path:string):boolean {
  if (path === '/welcome') return true;
  const restRoute:any[] = [];
  restRoute.push(routeTree);
  while (restRoute.length !== 0) {
    let route = restRoute.shift();
    if (route.rightsPath === path) return true;
    if (route.children && route.children.length !== 0) {
      restRoute.push(...route.children);
    }
  }
  return false;
}
function getAllRoute() {
  const userInfo = window.sessionStorage.getItem('userInfo');
  if (!userInfo) return [];
  const routes = JSON.parse(userInfo).rightsTree;
  for (let i = 0; i < routes.length; i++) {
    if (routes[i].rightsType === 'router') {
      return routes[i];
    }
  }
}

export default router
