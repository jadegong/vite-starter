/**
 * 路由定义
 * v0.0.1 2023/02/28 gqd Split top menu and sider menu layouts;
 */
import { DashboardOutlined, SettingOutlined, UserOutlined } from '@ant-design/icons-vue';
// import BasicLayout from '../layouts/BasicLayout.vue';
import BlankLayout from '../layouts/BlankLayout.vue';
import TopMenuOnlyLayout from '@/layouts/TopMenuOnlyLayout.vue';
import SiderMenuOnlyLayout from '@/layouts/SiderMenuOnlyLayout.vue';

const asyncRouterMap = [
  {
    path: '/',
    name: 'index',
    component: TopMenuOnlyLayout,
    redirect: '/dashboard',
    meta: { title: '' },
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
        component: SiderMenuOnlyLayout,
        meta: { title: '系统管理', icon: SettingOutlined },
        redirect: '/sys/userManage',
        children: [
          {
            path: '/sys/userManage',
            name: 'userManage',
            component: () => import('../views/Sys/User/index.vue'),
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

const constantRouterMap = [
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

export { asyncRouterMap, constantRouterMap };
