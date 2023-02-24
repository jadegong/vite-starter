import {createApp} from 'vue'
import Antd from 'ant-design-vue';
// import AntdvBusinessCommon from '../packages';

import router from './router'
import App from './App.vue'
import store from '@/store'

import 'ant-design-vue/dist/antd.css';

// mock
// WARNING: `mockjs` NOT SUPPORT `IE` PLEASE DO NOT USE IN `production` ENV.
import './mock'
// permission control
import './permission'

const app = createApp(App)

app.use(router)
app.use(store)

app.use(Antd);
// app.use(AntdvBusinessCommon);

app.mount('#app')
