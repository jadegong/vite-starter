<!-- v0.0.1 2023/02/28 gqd 仅有header的布局; -->
<!--        2023/01/03 gqd Change to insensitive name; -->
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
    </a-layout-header>
    <router-view></router-view>
  </a-layout>
</template>

<script lang="ts">
import { defineComponent, reactive, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import defaultSettings from '@/config/defaultSettings';
import store from '@/store';
import logoPng from '@/assets/images/logo.png';

import CustomIcon from '@/components/CustomIcon';

interface TopMenuOnlyLayoutState {
  title: string;
  selectedTopKeys: Array<any>;
  menus: Array<any>;
  logoPng: any;
}

export default defineComponent({
  name: 'TopMenuOnlyLayout',
  components: {
    CustomIcon,
  },
  setup() {
    const router = useRouter();
    const route = useRoute();
    const mainMenus = store.state.permission.addRouters;
    const routes = mainMenus.find((item: any) => item.path === '/');
    // Variables defination
    const topMenuOnlyLayoutState = reactive<TopMenuOnlyLayoutState>({
      title: defaultSettings.title,
      selectedTopKeys: [],
      menus: (routes && routes.children) || Array<any>(),
      logoPng: logoPng,
    });

    const handleTopMenuClick = (clickEvent: any) => {
      const { item, key, keyPath } = clickEvent;
      router.push({ name: key });
    };

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
    };
  },
});
</script>

<style lang="less">
@import './TopMenuOnlyLayout.less';
</style>
