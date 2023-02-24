<!-- v0.0.1 2023/01/04 gqd Init version; -->
<!--        2023/01/03 gqd Change to insensitive name; -->
<!--        2023/01/11 gqd Use typescript; -->
<!--        2023/01/17 gqd Optimize layout; -->
<template>
  <a-layout style="height: 100%">
    <a-layout-header class="self-topbar">
      <div class="logo">
        <img alt="Vue logo" src="./assets/images/logo.png" />
      </div>
      <div class="self-topbar-title">
        <span>{{ title }}</span>
      </div>
      <a-menu v-model:selectedKeys="selectedTopKeys" theme="dark" mode="horizontal" :style="{ lineHeight: '64px' }">
        <a-menu-item v-for="menuItem in menus" :key="menuItem.name"><custom-icon :component="menuItem.meta.icon" />{{ menuItem.meta.title }}</a-menu-item>
      </a-menu>
    </a-layout-header>
    <a-layout style="padding: 0 4px">
      <a-layout-sider width="240" style="background: #fff; min-height: 100%; padding: 24px 0">
        <a-menu v-model:selectedKeys="selectedSideKeys" v-model:openKeys="openSideKeys" @select="handleMenuSelect" mode="inline" style="height: 100%">
          <template v-for="menuItem in menus">
            <!-- 没有子菜单 -->
            <a-menu-item v-if="!menuItem.children || menuItem.children.length <= 0" :key="menuItem.name">
              <!-- <user-outlined /> -->
              {{ menuItem.meta.title }}
            </a-menu-item>
            <!-- 有子菜单 -->
            <a-sub-menu v-else :key="menuItem.name">
              <template #title>
                <span>
                  <!-- <laptop-outlined /> -->
                  {{ menuItem.meta.title }}
                </span>
              </template>
              <a-menu-item v-for="subMenuItem in menuItem.children" :key="subMenuItem.name">{{ subMenuItem.meta.title }}</a-menu-item>
            </a-sub-menu>
          </template>
        </a-menu>
      </a-layout-sider>
      <div class="page-container">
        <a-breadcrumb style="margin: 16px 0">
          <a-breadcrumb-item v-for="matchedRoute in currentMatchedRoutes" :key="matchedRoute.name">{{ matchedRoute.meta.title }}</a-breadcrumb-item>
        </a-breadcrumb>
        <div class="page-content-container">
          <router-view></router-view>
        </div>
      </div>
    </a-layout>
  </a-layout>
</template>

<script lang="ts">
import { defineComponent, reactive, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import routes from '../router';
import defaultSettings from '@/config/defaultSettings';

import CustomIcon from '@/components/CustomIcon'

interface BasicLayoutState {
  title: string;
  selectedTopKeys: Array<string>;
  selectedSideKeys: Array<string>;
  openSideKeys: Array<string>;
  menus: Array<any>;
  currentMatchedRoutes: Array<any>;
}

export default defineComponent({
  name: 'BasicLayout',
  components: {
    CustomIcon,
  },
  setup() {
    // Variables defination
    const basicLayoutState = reactive<BasicLayoutState>({
      title: defaultSettings.title,
      selectedTopKeys: ['antdvBusinessCommon'],
      selectedSideKeys: Array<string>(),
      openSideKeys: Array<string>(),
      menus: routes || Array<any>(),
      currentMatchedRoutes: Array<any>(),
    });
    const router = useRouter();
    // functions
    const handleMenuSelect = (obj: any) => {
      const { keyPath } = obj;
      for (let i = routes.length - 1; i >= 0; i--) {
        if (routes[i].name === keyPath[0]) {
          if (keyPath.length === 1) {
            router.push({ path: routes[i].path });
          } else if (keyPath.length > 1) {
            for (let j = routes[i].children.length - 1; j >= 0; j--) {
              if (routes[i].children[j].name === keyPath[1]) {
                router.push({ path: routes[i].children[j].path });
              }
            }
          }
        }
      }
    };

    // Life cycles
    onMounted(() => {
      router.afterEach((to: any, from: any) => {
        const { matched } = to;
        basicLayoutState.currentMatchedRoutes = matched;
        if (matched.length >= 1) {
          basicLayoutState.selectedSideKeys = [matched[matched.length - 1].name];
          if (matched.length > 1) {
            basicLayoutState.openSideKeys = [matched[0].name];
          }
        }
      });
    });

    return {
      basicLayoutState,
      handleMenuSelect,
    };
  },
});
</script>

<style lang="less" scoped>
@import './BasicLayout.less';
</style>
