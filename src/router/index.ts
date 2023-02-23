import HomeView from '../views/HomeView.vue';
import BasicLayout from '../layouts/BasicLayout.vue';
import BlankLayout from '../layouts/BlankLayout.vue';

export const asyncRouterMap = [
  {
    path: '/',
    name: 'index',
    component: BasicLayout,
    redirect: '/start',
    meta: { title: 'Vite Starter' },
    children: [
      {
        path: '/start',
        name: 'startPage',
        component: () => import('../views/HomeView.vue'),
        meta: { title: '开始' },
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
        component: BlankLayout,
      }
    ],
  },
  {
    path: '/404',
    name: 'exception404',
    component: () => import('../views/Exception/404.vue'),
  },
];

export default asyncRouterMap;
