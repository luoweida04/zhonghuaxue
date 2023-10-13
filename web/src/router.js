import Vue from 'vue'
import Router from 'vue-router'
const Home = () => import('./views/Home')
const Login = () => import('./views/Login')
Vue.use(Router)
const router = new Router({
    mode: 'hash',
    routes: [
        {
            path: '/',
            redirect: '/login',
        },
        {
            path: '/login',
            name: 'login',
            component: Login
        },
        {
            path: '/home',
            name: "home",
            component: Home,
        },
    ]
})
export default router
