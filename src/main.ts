import {createApp} from 'vue'
import {createRouter, createWebHistory} from 'vue-router'
import Antd from 'ant-design-vue';
import AntdvBusinessCommon from '../packages';

import asyncRoutes from './router'
import App from './App.vue'
import store from '@/store'

import 'ant-design-vue/dist/antd.css';

const app = createApp(App)

// 创建路由实例，并传递配置
const router = createRouter({
  history: createWebHistory(),
  routes: asyncRoutes,
});

app.use(router)
app.use(store)

app.use(Antd);
app.use(AntdvBusinessCommon);

app.mount('#app')
