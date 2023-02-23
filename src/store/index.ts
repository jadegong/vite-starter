/*
 * @Descripttion: store 定义文件
 * @version:
 * @Author: gqd
 * @Date: <2023-02-23 Thu>
 * @LastEditors: Please set LastEditors
 * @LastEditTime: <2023-02-23 Thu>
 */
import { createStore } from 'vuex'

// import app from './modules/app'
import user from './modules/user'
import publicStore from './modules/public'

// default router permission control
import permission from './modules/permission'

// dynamic router permission control (Experimental)
// import permission from './modules/async-router'
import getters from './getters'

const store = createStore({
  modules: {
    // app,
    user,
    publicStore,
    permission
  },
  getters
})

export default store
