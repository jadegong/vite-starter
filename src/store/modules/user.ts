/**
 * 用户数据
 */
import type { ActionContext } from 'vuex';
import { ACCESS_TOKEN, USER_INFO_SESSION_STORAGE } from '@/store/mutation-types';
import config from '@/config/defaultSettings';

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
  },
};

export default user;
