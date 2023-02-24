/**
 * 登录相关接口
 * v0.0.1 2023/02/23 gqd Init;
 */
import request from '@/utils/request';
import { baseUrl } from './config';

export const loginApi = {
  login: baseUrl + '/login',
  userInfo: baseUrl + '/user/info',
  // userInfo: 'http://easymock.vr-seesee.com/mock/618d2d7ac6efbbd8132a2d4c/user/userInfo',
  logout: baseUrl + '/logout',
  captcha: baseUrl + '/captcha',
  publicKey: baseUrl + '/getSecretKey', // 获取加密密钥

  // PB跳转登录
  pbJumpLogin: baseUrl + '/login/authLogin',
};

export function login(parameter: any) {
  // const { captchaId, restParams } = parameter;
  return request({
    url: loginApi.login,
    method: 'post',
    data: parameter,
  });
}

export function getInfo() {
  return request({
    url: loginApi.userInfo,
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
  });
}

export function logout() {
  return request({
    url: loginApi.logout,
    method: 'post',
  });
}

export function getPublicKey() {
  return request({
    url: loginApi.publicKey,
    method: 'post',
  });
}

export function getCaptchaCode() {
  return request({
    url: loginApi.captcha,
    method: 'post',
  });
}

export function pbJumpLogin(parameter: any) {
  return request({
    url: loginApi.pbJumpLogin,
    method: 'post',
    data: parameter,
  });
}
