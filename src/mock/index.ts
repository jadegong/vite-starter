/**
 * Mock数据主文件
 * v0.0.1 2023/02/23 gqd Init;
 *        2023/02/28 gqd Add sys mock file;
 */
import Mock from 'mockjs2';
import { isIE } from '@/utils/util';
import config from '@/config/defaultSettings';
import loginMock from '@/mock/services/login';
import sysMock from '@/mock/services/sys';

// 判断环境不是 prod 或者 preview 是 true，并且配置使用mock时，加载 mock 服务
if ((process.env.NODE_ENV !== 'production' || process.env.VUE_APP_PREVIEW === 'true') && config.useMock) {
  if (isIE()) {
    console.error('[vite-starter] ERROR: `mockjs` NOT SUPPORT `IE` PLEASE DO NOT USE IN `production` ENV.');
  }
  // 使用同步加载依赖
  // 防止 vuex 中的 GetInfo 早于 mock 运行，导致无法 mock 请求返回结果
  console.log('[vite-starter] mock mounting');
  // const Mock = require('mockjs2');
  // require('@/mock/services/login')
  loginMock();
  sysMock();

  Mock.setup({
    timeout: 800, // setter delay time
  });
  console.log('[vite-starter] mock mounted');
}
