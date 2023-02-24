/**
 * 用户数据
 * v0.0.1 2023/02/24 gqd Add GetInfo action;
 */
import type { ActionContext } from 'vuex';
import { asyncRouterMap } from '@/config/router.config';
import { ACCESS_TOKEN, USER_INFO_SESSION_STORAGE } from '@/store/mutation-types';
import config from '@/config/defaultSettings';
import toolUtil from '@/utils/toolUtil';
import { login } from '@/api/user';
import { queryMenuListByRole } from '@/api/sys';

interface UserModuleStateTypeModel {
  token: string;
  info: any;
}

interface UserModuleTypeModel {
  state: UserModuleStateTypeModel;
  mutations: any;
  actions: any;
}

const user: UserModuleTypeModel = {
  state: {
    token: '',
    info: '',
  },
  mutations: {
    SET_TOKEN: (state: UserModuleStateTypeModel, token: string) => {
      state.token = token;
    },
    SET_INFO: (state: UserModuleStateTypeModel, info: any) => {
      state.info = info;
    },
  },
  actions: {
    SetLoginInfo({ commit }: ActionContext<UserModuleStateTypeModel, any>, userInfo: any) {
      return new Promise((resolve, reject) => {
        if (userInfo.token) {
          sessionStorage.setItem(ACCESS_TOKEN, userInfo.token);
          commit('SET_TOKEN', userInfo.token);
        }
        if (userInfo) {
          sessionStorage.setItem(USER_INFO_SESSION_STORAGE, JSON.stringify(userInfo)); // 将用户信息缓存至sessionStorage里，刷新时不用每次都调接口取
          commit('SET_INFO', userInfo);
        }
        resolve(userInfo);
      });
    },
    Login({ commit }: ActionContext<UserModuleStateTypeModel, any>, userInfo: any) {
      return new Promise((resolve, reject) => {
        if (config.routePermission) {
          login(userInfo).then((response: any) => {
            const result = response;
            sessionStorage.setItem(ACCESS_TOKEN, result.token);
            commit('SET_TOKEN', result.token);
            commit('SET_INFO', result);
            resolve(result);
          });
        } else {
          sessionStorage.setItem(ACCESS_TOKEN, 'NO_PERMISSIONS_ACCESS_TOKEN');
          commit('SET_TOKEN', 'NO_PERMISSIONS_ACCESS_TOKEN');
          resolve(null);
        }
      });
    },
    Logout({ commit }: ActionContext<UserModuleStateTypeModel, any>) {
      return new Promise((resolve) => {
        commit('SET_TOKEN', '');
        sessionStorage.removeItem(ACCESS_TOKEN);
        sessionStorage.removeItem(USER_INFO_SESSION_STORAGE);
        resolve(null);
      });
    },
    // 获取用户信息
    GetInfo({ commit }: ActionContext<UserModuleStateTypeModel, any>) {
      return new Promise((resolve, reject) => {
        const userInfo = JSON.parse(sessionStorage.getItem(USER_INFO_SESSION_STORAGE) || '');
        commit('SET_INFO', userInfo);
        resolve(userInfo);
      });
    },
    // 获取菜单
    GetMenus({ commit }: ActionContext<UserModuleStateTypeModel, any>, user: any) {
      function getPermissionIds(arr: Array<any>) {
        let retArr: Array<any> = [];
        arr.forEach((item) => {
          retArr.push({ permissionId: item.name });
          if (item.children && item.children.length >= 1) {
            retArr = retArr.concat(getPermissionIds(item.children));
          }
        });
        return retArr;
      }
      return new Promise((resolve, reject) => {
        if (config.routePermission) {
          const userInfo = JSON.parse(sessionStorage.getItem(USER_INFO_SESSION_STORAGE) || '');
          queryMenuListByRole({ roleId: userInfo.roleTypeId })
            .then((response: any) => {
              const menus = response.data;
              const list = [
                {
                  // url: '/',
                  permissionId: 'index',
                },
              ];
              const flatMenus: Array<any> = [];
              toolUtil.treeToList(menus, flatMenus, 'childList');

              function loop(arr: Array<any>) {
                arr
                  .sort((a, b) => a.sort - b.sort)
                  .forEach((element: any) => {
                    let temp = { permissionId: element.id };
                    element.permissionId = element.id;
                    list.push(temp);
                    // if (element.childList && element.childList.length > 0) {
                    // loop(element.childList)
                    // }
                  });
              }

              loop(flatMenus);
              user.permissions = list;
              resolve(user);
            })
            .catch((error: any) => {
              reject(error);
            });
        } else {
          user.permissions = getPermissionIds(asyncRouterMap);
          resolve(user);
        }
      });
    },
  },
};

export default user;
