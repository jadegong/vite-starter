/*
 * @Descripttion: 权限相关的store
 * @version:
 * @Author: gqd
 * @Date: 2023/02/23
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2023/02/23
 */
import type { ActionContext } from 'vuex';
import { asyncRouterMap, constantRouterMap } from '@/config/router.config';

interface PermissionModuleStateTypeModel {
  routers: Array<any>;
  addRouters: Array<any>;
}

interface PermissionModuleTypeModel {
  state: PermissionModuleStateTypeModel;
  mutations: any;
  actions: any;
}

/**
 * 过滤账户是否拥有某一个权限，并将菜单从加载列表移除
 *
 * @param permissions
 * @param route
 * @returns {boolean}
 */
function hasPermission(permissions: Array<any>, route: any) {
  if (permissions && permissions.length > 0) {
    let flag = false;
    for (let i = 0, len = permissions.length; i < len; i++) {
      if (route.name === permissions[i].permissionId) {
        flag = true;
        break;
      }
    }
    return flag;
  }
  return true;
}

/**
 * 过滤需要校验权限的路由
 * @param routerMap Array<any> 需要校验的原始数组
 * @param user Object<{permissions: Array<Object{permissionId: string}>, ...}> 用户信息，包含permissions权限数组
 * @returns {Array<any>} 返回过滤后的路由数组
 */
function filterAsyncRouter(routerMap: Array<any>, user: any) {
  if (user.permissions === undefined) {
    return routerMap;
  }
  let accessedRouters: Array<any> = [];
  routerMap.forEach((route: any) => {
    let temp = { ...route, children: undefined };
    if (hasPermission(user.permissions, route)) {
      // 如果传入的user.permissions为undefined，则表示不开启权限控制，直接返回true
      if (route.children && route.children.length) {
        temp.children = filterAsyncRouter(route.children, user);
      }
      accessedRouters.push(temp);
    }
  });
  return accessedRouters;
}

const permission: PermissionModuleTypeModel = {
  state: {
    routers: Array<any>(),
    addRouters: Array<any>(),
  },
  mutations: {
    SET_ROUTERS: (state: PermissionModuleStateTypeModel, routers: Array<any>) => {
      state.addRouters = routers;
      state.routers = constantRouterMap.concat(routers);
    },
  },
  actions: {
    GenerateRoutes({ commit }: ActionContext<PermissionModuleStateTypeModel, any>, data: any) {
      return new Promise((resolve) => {
        const { user } = data;
        const accessedRouters = filterAsyncRouter(asyncRouterMap, user);
        commit('SET_ROUTERS', accessedRouters);
        resolve(null);
      });
    },
  },
};

export default permission;
