/**
 * 登录相关的接口mock
 *
 * v0.0.1 2023/02/23 gqd Init;
 *        2023/02/28 gqd Use export module;
 */
import JSEncrypt from 'jsencrypt';
import Mock from 'mockjs2';
import { builder, getBody } from '../util';
import { loginApi } from '@/api/user';

const defaultRsaPubKey =
  '-----BEGIN PUBLIC KEY-----\n' +
  'MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCgr+cQgEEod4qf5SbjJ9CkDjR5\n' +
  'JuCZba9VKgTZktBd4VpLwLrFr2DJ0F+sdGGs1KB317k3FDEJEKb4zI8SM3dG/h0h\n' +
  'VOi5+QgJrR0Van7iZ7bBg7e5ruU3OfZRQZl4oeGoKjjZccB8I5K/hyjtcD0VLcrD\n' +
  'jVuVTE0jRDwQb1GwYwIDAQAB\n' +
  '-----END PUBLIC KEY-----';

const defaultRsaPrivKey =
  '-----BEGIN PRIVATE KEY-----\n' +
  'MIICdgIBADANBgkqhkiG9w0BAQEFAASCAmAwggJcAgEAAoGBAKCv5xCAQSh3ip/l\n' +
  'JuMn0KQONHkm4Jltr1UqBNmS0F3hWkvAusWvYMnQX6x0YazUoHfXuTcUMQkQpvjM\n' +
  'jxIzd0b+HSFU6Ln5CAmtHRVqfuJntsGDt7mu5Tc59lFBmXih4agqONlxwHwjkr+H\n' +
  'KO1wPRUtysONW5VMTSNEPBBvUbBjAgMBAAECgYAuVIl66H/g+xatI5UiycgOhUn7\n' +
  '5Im9szJqi8L6OKp7Zw5x6Q/xD7AIgFwVjTjcbDIYW8q7Zsb8piB+e/yEcvJgwLyE\n' +
  'vLVAqfkeNIgNWVV/f85H+4xORVGHwWhR5ZZF1KXgLkEc01yNwnd59crf+BMqODyi\n' +
  '+EHGmfG4LTNUm3GBAQJBANIFCLM4AW6Auij/PZuhH7SdAQw7gH8WdIDI+jVRiV3i\n' +
  'etozCduiZUzTTcbyjgYJAP1hVXc/T6YxRyFQWrQy3YkCQQDD3e3Nxm7Z8u6nXVRt\n' +
  '7vtrmRq5imWaBoJN4I9vcuqQyjiHR8Y0ci3USt94nUIcjxbaQ1ggc21f+xl+4+HA\n' +
  'PW+LAkAh+0aJGQrCQnncoE/rmopywuSkggwshAmdvOcfMW40jqyqGZACxaf2Yko3\n' +
  'Yo+wUkyistkNTmUo0thbf5Dtjz1hAkAuw2rGaW0H7j9aiCbjRF6Utu4xhEBzwMAV\n' +
  'ldrJEhe8z/slGVbSKLyWZfXq1yj0ppkfLVr6DHT9qHbS29eHTWO3AkEAsu+N+Sra\n' +
  'mC2I89CThuj8AGgVhN4TYmLdbooG92CZ9hsJ59LZWT/F/FhUyf2U8CD7jE35/Gbq\n' +
  'swFbNnSplrb2iw==\n' +
  '-----END PRIVATE KEY-----';

const defaultCaptcha =
  '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';

const username = ['admin', 'province'];
const password = ['123456', 'admin', '1qaz!QAZ'];

const publicKey = () => {
  return Mock.mock({
    status: '0',
    data: {
      key: '@id()',
      publicKey: defaultRsaPubKey,
    },
    message: '成功',
  });
};

const captcha = () => {
  return Mock.mock({
    status: '0',
    message: '成功',
    data: {
      encodeStr: defaultCaptcha,
      captchaId: '16757400372972',
    },
    total: 0,
  });
};

const login = (options: any) => {
  const body = getBody(options);
  console.log('mock: body', body);
  let encryptor = new JSEncrypt();
  encryptor.setPrivateKey(defaultRsaPrivKey);
  let decryptedUserName = encryptor.decrypt(body.userName);
  let decryptedPassword = encryptor.decrypt(body.password);
  if (!username.includes(decryptedUserName.toString()) || !password.includes(decryptedPassword.toString())) {
    return builder({ isLogin: true }, '账户或密码错误', 401);
  }
  const res = {
    status: '0',
    data: {
      token: '4291d7da9005377ec9aec4a71ea837f',
      operId: '天野远子',
      roleTypeId: '01',
      provinceId: '000',
    },
    message: '成功',
  };
  console.log(res);
  return res;
};

const logout = () => {
  return Mock.mock({
    status: '0',
    data: [],
    message: '成功',
  });
};

const pbJumpLogin = (params: any) => {
  let res = Mock.mock({
    status: '0',
    data: {
      token: '@word(30)',
      operId: 'admin',
      roleTypeId: '01',
      provinceId: '000',
    },
    message: '成功',
  });
  return res;
};

export default () => {
  Mock.mock(loginApi.publicKey, 'post', publicKey);
  Mock.mock(loginApi.captcha, 'post', captcha);
  Mock.mock(loginApi.login, 'post', login);
  Mock.mock(loginApi.logout, 'post', logout);
  Mock.mock(loginApi.pbJumpLogin, 'post', pbJumpLogin);
};
