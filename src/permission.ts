/*
 * @Author: gqd
 * @Date: 2023/02/24
 * @LastEditTime: 2023/02/24
 * @Description: 权限控制校验;
 * @FilePath: /src/permission.js
 * v1.0.0 2023/02/24 gqd Init;
 */
import type { RouteLocationNormalized, NavigationGuardNext } from 'vue-router';
import router from '@/router';
import store from '@/store';
import { setDocumentTitle, domTitle } from '@/utils/domUtil';
import { ACCESS_TOKEN } from '@/store/mutation-types';

import notification from 'ant-design-vue/es/notification';

const allowList: Array<any> = ['login', 'exception404']; // no redirect allowList
const loginRoutePath = '/user/login';
const defaultRoutePath = '/';

router.beforeEach((to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext) => {
  to.meta && typeof to.meta.title !== 'undefined' && setDocumentTitle(`${to.meta.title} - ${domTitle}`);
  if (sessionStorage.getItem(ACCESS_TOKEN)) {
    if (to.path === loginRoutePath) {
      next({ path: defaultRoutePath });
    } else {
      // check login user is null
      if (!store.getters.user || store.getters.addRouters.length <= 0) {
        // request login userInfo
        store
          .dispatch('GetInfo')
          .then((res) => {
            const user = res;
            store.dispatch('GetMenus', user).then((res1) => {
              // 获取菜单: user.permissions = [...]
              store.dispatch('GenerateRoutes', { user: res1 }).then(() => {
                // 根据roles权限生成可访问的路由表
                // 动态添加可访问路由表
                store.getters.addRouters.forEach((routeItem: any) => {
                  router.addRoute(routeItem);
                });
                // router.addRoutes(store.getters.addRouters);
                // 请求带有 redirect 重定向时，登录自动重定向到该地址
                const redirect = decodeURIComponent(from.query.redirect?.toString() || to.path);
                // console.log(to.path, user, redirect);
                if (redirect === '/sys') {
                  let haveSysMenu = false;
                  user.permissions.forEach((val: any) => {
                    if (val.permissionId === 'sysManage') {
                      haveSysMenu = true;
                    }
                  });
                  if (haveSysMenu) {
                    if (to.path === redirect) {
                      // set the replace: true so the navigation will not leave a history record
                      next({ ...to, replace: true, query: {} });
                    } else {
                      // 跳转到目的路由
                      next({ path: redirect, query: {} });
                    }
                  } else {
                    next({ path: '/dashboard', query: {} });
                  }
                } else {
                  if (to.path === redirect) {
                    // set the replace: true so the navigation will not leave a history record
                    next({ ...to, replace: true, query: {} });
                  } else {
                    // 跳转到目的路由
                    next({ path: redirect, query: {} });
                  }
                }
              });
            });
          })
          .catch(() => {
            notification.error({
              message: '错误',
              description: '请求用户信息失败，请重试',
            });
            // 失败时，获取用户信息失败时，调用登出，来清空历史保留信息
            // store.dispatch('Logout').then(() => {
            //   next({ path: loginRoutePath, query: { redirect: to.fullPath } })
            // })
          });
      } else {
        next();
      }
    }
  } else {
    if (allowList.includes(to.name)) {
      // 在免登录名单，直接进入
      next();
    } else {
      next({ path: loginRoutePath, query: { redirect: to.fullPath } });
    }
  }
});
