import Vue from 'vue'
import VueRouter from 'vue-router'

import Config from './../pages/Config.vue'
// import Main from './../pages/Main.vue'

Vue.use(VueRouter)

const routes = [
    // {
    //     path: '/',
    //     name: 'Main',
    //     component: Main
    // },
    {
        path: '/config',
        name: 'Config',
        component: Config
    }
]

const router = new VueRouter({
    mode: 'history',
    base: '',
    routes
})

export default router