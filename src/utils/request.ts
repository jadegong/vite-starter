/**
 * v1.0.0 2022/02/24 gqd 文件接口优化处理;
 *        2022/03/01 gqd post请求统一为json格式;
 *        2022/04/14 gqd 需要重新登录的错误处理;
 * v1.5.6 2023/01/13 gqd 上传文件的headers['Content-Type']统一使用form格式;
 */
import type { App } from 'vue';
import axios from 'axios';
import type { InternalAxiosRequestConfig, AxiosResponse } from 'axios';

import notification from 'ant-design-vue/es/notification';
import $message from 'ant-design-vue/es/message';

import { VueAxios } from './axios';
import store from '@/store';
import { ACCESS_TOKEN } from '@/store/mutation-types';
import qs from 'qs';
import constants from './constants';
import config from '@/config/defaultSettings';

// 创建 axios 实例
const request = axios.create({
  // API 请求的默认前缀
  // baseURL: process.env.VUE_APP_API_BASE_URL,
  timeout: 6000 * 10, // 请求超时时间
  // headers: { 'Content-Type': 'application/json' },
});
request.defaults.headers.post['Content-Type'] = 'application/json';

// 异常拦截处理器
const errorHandler = (error: any) => {
  const resObj = error.response;
  if (error.response) {
    const data = error.response.data;
    // // 从 localstorage 获取 token
    const token = sessionStorage.getItem(ACCESS_TOKEN);
    if (error.response.status === 403) {
      notification.error({
        message: 'Forbidden',
        description: data.message || resObj.statusText,
      });
    }
    // 暂时的错误处理
    else if (error.response.status === 401) {
      // 401拦截，如果返回数据里的status为407，需要重新登录
      // $message.error(error.response.data.msg)
      notification.error({
        message: resObj.status,
        description: (data && data.message) || resObj.statusText,
      });
      if (data && data.status === '407') {
        if (token) {
          store.dispatch('Logout').then(() => {
            setTimeout(() => {
              // window.location.reload()
              window.location.href = `${config.routerBase}user/login`;
            }, 1500);
          });
        }
      }
    } else if (error.response.status === 202) {
      $message.warn(error.response.data.msg);
    } else {
      notification.error({
        message: resObj.status,
        description: (resObj.data && resObj.data.message) || resObj.statusText,
      });
    }
  }
  return Promise.reject(error);
};

// request interceptor
request.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = sessionStorage.getItem(ACCESS_TOKEN);
  // 如果 token 存在
  // 让每个请求携带自定义 token 请根据实际情况自行修改
  if (token) {
    config.headers['Authorization'] = token;
  }
  // v1.5.6 2023/01/13 gqd 上传文件的headers统一使用form格式;
  if (config.method === 'post' && config.data instanceof FormData) {
    config.headers['Content-Type'] = 'multipart/form-data';
  }
  if (config.method === 'get') {
    config.paramsSerializer = {
      serialize: function (params: any) {
        return qs.stringify(params, { arrayFormat: 'repeat' });
      },
    };
  }
  return config;
}, errorHandler);

// response interceptor
request.interceptors.response.use((response: AxiosResponse<any, any>) => {
  const data = response.data;
  const disposition = response.headers['content-disposition'];
  if (disposition) {
    // 下载文件接口需要从response.headers中获取文件名
    return {
      blob: response.data,
      fileName: decodeURI(disposition.split(';')[1].split('filename=')[1]),
    };
  }
  if (data) {
    // 后台返回数据
    if (data.status !== constants.REQUEST_STATUS_SUCCESS) {
      notification.error({
        message: '请求出错',
        description: data.message || data.msg || '',
      });
    }
  }
  return response.data;
}, errorHandler);

const installer = {
  vm: {},
  install(app: App) {
    app.use(VueAxios, request);
  },
};

export default request;

export { installer as VueAxios, request as axios };
