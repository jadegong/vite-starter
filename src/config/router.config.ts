import {
    DashboardOutlined,
    SettingOutlined,
    UserOutlined,
} from '@ant-design/icons-vue'
import BasicLayout from '../layouts/BasicLayout.vue';
import BlankLayout from '../layouts/BlankLayout.vue';

export const asyncRouterMap = [
  {
    path: '/',
    name: 'index',
    component: BasicLayout,
    redirect: '/dashboard',
    meta: { title: 'Vite Starter' },
    children: [
      {
        path: '/dashboard',
        name: 'dashboard',
        component: () => import('../views/HomeView.vue'),
          meta: { title: '首页', icon: DashboardOutlined },
      },
      {
        path: '/sys',
        name: 'sysManage',
        component: BlankLayout,
        meta: { title: '系统管理', icon: SettingOutlined },
        redirect: '/sys/userManage',
        children: [
          {
            path: '/sys/userManage',
            name: 'userManage',
            component: () => import('../views/Sys/User'),
            meta: { title: '用户管理', icon: UserOutlined },
          },
        ],
      },
    ],
  },
  // {
  // path: '/dataEntryDemo',
  // name: 'dataEntryDemo',
  // component: BlankLayout,
  // meta: { title: '数据录入' },
  // children: [
  // {
  // path: '/dataEntryDemo/typeDatePicker',
  // name: 'typeDatePickerDemo',
  // component: () => import('../views/TypeDatePicker/index.vue'),
  // meta: { title: '类型时间选择' },
  // },
  // ],
  // },
  // {
  // path: '/otherDemo',
  // name: 'otherDemo',
  // component: BlankLayout,
  // meta: { title: '其他' },
  // children: [
  // {
  // path: '/otherDemo/sliderImgCheckbox',
  // name: 'sliderImgCheckboxDemo',
  // component: () => import('../views/SliderImgCheckbox/index.vue'),
  // meta: { title: '滑动验证码' },
  // },
  // ],
  // },
];

export const constantRouterMap = [
  {
    path: '/user',
    name: 'user',
    component: BlankLayout,
    redirect: '/user/login',
    hidden: true,
    children: [
      {
        path: 'login',
        name: 'login',
        component: () => import('../views/User/Login.vue'),
      },
    ],
  },
  {
    path: '/404',
    name: 'exception404',
    component: () => import('../views/Exception/404.vue'),
  },
];

export default asyncRouterMap;
