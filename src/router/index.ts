import { createRouter, createWebHistory } from 'vue-router'
import { constantRouterMap } from '@/config/router.config'
import config from '@/config/defaultSettings'

const router = createRouter({
    history: createWebHistory(config.routerBase),
    routes: constantRouterMap,
})

export default router
