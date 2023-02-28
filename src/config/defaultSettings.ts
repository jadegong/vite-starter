/*
 * @Descripttion:
 * @version:
 * @Author: ljx
 * @Date: 2021-07-13 09:49:55
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2022-02-21 15:26:48
 * v1.4.0 2022/04/21 gqd 启用路由权限控制;
 */
/**
 * 项目默认配置项
 * primaryColor - 默认主题色, 如果修改颜色不生效，请清理 localStorage
 * navTheme - sidebar theme ['dark', 'light'] 两种主题
 * colorWeak - 色盲模式
 * layout - 整体布局方式 ['sidemenu', 'topmenu'] 两种布局
 * fixedHeader - 固定 Header : boolean
 * fixSiderbar - 固定左侧菜单栏 ： boolean
 * contentWidth - 内容区布局： 流式 |  固定
 *
 * storageOptions: {} - Vue-ls 插件配置项 (localStorage/sessionStorage)
 *
 */

export default {
    navTheme: 'light', // theme for nav menu
    primaryColor: '#1890ff', // primary color of ant design
    layout: 'topmenu', // nav menu position: `sidemenu` or `topmenu`
    contentWidth: 'Fluid', // layout of content: `Fluid` or `Fixed`, only works when layout is topmenu
    fixedHeader: false, // sticky header
    fixSiderbar: false, // sticky siderbar
    colorWeak: false,
    menu: {
        locale: true
    },
    title: '中国移动车联卡连接管理平台',
    pwa: false,
    iconfontUrl: '',
    production: process.env.NODE_ENV === 'production' && process.env.VUE_APP_PREVIEW !== 'true',
    useMock: true, // 是否启用mock
    routePermission: false, // 是否启用路由权限控制
    routerBase: '/vite-starter/', // 路由base，默认/
    publicKey: 'MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA3btKVk19xMPHzedTt1565vrJEJ7cLjPmm2Qr0aCNgOj3Al66I13UwiEK/UiBb/qLRxaYT5QX2Co6qq8Z1xTxIAikA5drjAN8oiBjexshEeCyUK90khK1FDK0qYULLm0s7KcX0hIo7FX4F7bXkRw5laS0DiBJOuRu0+xJt2LeMsXhhn2HKHI0hEWxmwJBHR5JItK8nVk/Q+mZj1fmRaLOTNUBvaWQ8mzPS2fc7gZ7ToIHWH05/QuJ4S08JYhz3ZFm3zvBDlOTLjFO+kCdYvd5dnFC8qHnqaiooE4r+hc3FpTthwqIDHeIe9WfWZiL/p8rqKHZudXK8UWxUGYoiZ3FGQIDAQAB', // 加密公钥
}
