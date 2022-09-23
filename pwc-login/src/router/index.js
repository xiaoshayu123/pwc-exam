import Vue from 'vue'
import Router from 'vue-router'
// import store from '../store/index.js'
import Home from '../views/Home'
import Login from '../views/Login'
import Register from '../views/Register'
import Github from '../views/Github'
import phone from '../views/phone'
Vue.use(Router)

const router = new Router({
  routes: [{
    path: '/',
    name: 'home',
    component: Home
  }, {
    path: '/login',
    name: 'login',
    component: Login
  }, {
    path: '/register',
    name: 'register',
    component: Register
  }, {
    path: '/github',
    name: 'github',
    component: Github
  },{
    path: '/phone',
    name: 'phone',
    component: phone
  }
]
})

export default router

