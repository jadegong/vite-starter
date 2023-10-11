<!-- v0.0.1 2023/02/28 gqd 仅有header的布局; -->
<!--        2023/01/03 gqd Change to insensitive name; -->
<!--        2023/10/11 gqd Add user name show and dropdown links; -->
<template>
  <a-layout style="height: 100%">
    <a-layout-header class="self-topbar">
      <div class="logo">
        <img alt="Vue logo" :src="topMenuOnlyLayoutState.logoPng" />
      </div>
      <div class="self-topbar-title">
        <span>{{ topMenuOnlyLayoutState.title }}</span>
      </div>
      <a-menu theme="dark" mode="horizontal" :selectedKeys="topMenuOnlyLayoutState.selectedTopKeys" @click="handleTopMenuClick">
        <a-menu-item v-for="menuItem in topMenuOnlyLayoutState.menus" :key="menuItem.name"><custom-icon :component="menuItem.meta.icon" style="margin-right: 4px" />{{ menuItem.meta.title }}</a-menu-item>
      </a-menu>
      <div class="self-topbar-right">
        <a-dropdown v-if="topMenuOnlyLayoutState.isLogin" placement="bottomRight">
          <a @click.prevent style="color: white;">
            {{ topMenuOnlyLayoutState.userInfo.operId }}
            <DownOutlined />
          </a>
          <template #overlay>
            <a-menu>
              <a-menu-item>
                <a href="javascript:;" disabled>
                  <UserOutlined />
                  个人中心
                </a>
              </a-menu-item>
              <a-menu-item>
                <a href="javascript:;" @click="handleLogout">
                  <LogoutOutlined />
                  注销
                </a>
              </a-menu-item>
            </a-menu>
          </template>
        </a-dropdown>
        <a-button v-else>登录</a-button>
      </div>
    </a-layout-header>
    <router-view></router-view>
  </a-layout>
</template>

<script lang="ts">
import {
  DownOutlined,
  LogoutOutlined,
  UserOutlined,
} from '@ant-design/icons-vue';
import { defineComponent, reactive, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import defaultSettings from '@/config/defaultSettings';
import store from '@/store';
import logoPng from '@/assets/logo.svg';

import CustomIcon from '@/components/CustomIcon';

interface TopMenuOnlyLayoutState {
  title: string;
  selectedTopKeys: Array<any>;
  menus: Array<any>;
  logoPng: any;
  isLogin: Boolean;
  userInfo: any;
}

export default defineComponent({
  name: 'TopMenuOnlyLayout',
  components: {
    CustomIcon,
    DownOutlined,
    LogoutOutlined,
    UserOutlined,
  },
  setup() {
    const router = useRouter();
    const route = useRoute();
    const mainMenus = store.state.permission.addRouters;
    const isLogin = store.state.user.token !== '';
    const userInfo = store.state.user.info;
    const routes = mainMenus.find((item: any) => item.path === '/');
    // Variables defination
    const topMenuOnlyLayoutState = reactive<TopMenuOnlyLayoutState>({
      title: defaultSettings.title,
      selectedTopKeys: [],
      menus: (routes && routes.children) || Array<any>(),
      logoPng: logoPng,
      isLogin: isLogin,
      userInfo,
    });

    const handleTopMenuClick = (clickEvent: any) => {
      const { item, key, keyPath } = clickEvent;
      router.push({ name: key });
    };

    const handleLogout = () => {
      // TODO: logout
    }

    const handleMenusData = (route: any) => {
      const { matched } = route;
      if (matched.length >= 2) {
        let matchedTopMenu = matched[1];
        topMenuOnlyLayoutState.selectedTopKeys = [matchedTopMenu.name];
      }
    };

    handleMenusData(route); // Deal with refresh page

    // Life cycles
    onMounted(() => {
      router.afterEach((to: any, from: any) => {
        const { matched } = to;
        if (matched.length >= 1) {
          if (matched.length > 1) {
            const matchedTopMenu = matched[1]
            topMenuOnlyLayoutState.selectedTopKeys = [matchedTopMenu.name]
          }
        }
      });
    });

    return {
      topMenuOnlyLayoutState,
      handleTopMenuClick,
      handleLogout,
    };
  },
});
</script>

<style lang="less">
@import './TopMenuOnlyLayout.less';
</style>
