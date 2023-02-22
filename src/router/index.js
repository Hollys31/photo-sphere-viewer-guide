import Vue from 'vue'
import Router from 'vue-router'
/* import Layout from '@/components/layout' */
Vue.use(Router)
export const routes = [{
        path: '/',
        redirect: '/index'
    },

    {
        path: "/index",
        name: "index",
        component: () => import('@/views/photoSphereViewer/Index'),
    },
]



export default new Router({
    routes
})