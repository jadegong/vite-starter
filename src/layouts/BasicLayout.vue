<!-- v0.0.1 2023/01/04 gqd Init version; -->
<!--        2023/01/03 gqd Change to insensitive name; -->
<!--        2023/01/11 gqd Use typescript; -->
<!--        2023/01/17 gqd Optimize layout; -->
<!--        2023/03/01 gqd Change logo; -->
<template>
  <a-layout style="height: 100%">
    <a-layout-header class="self-topbar">
      <div class="logo">
        <img alt="Vue logo" src="../assets/logo.svg" />
      </div>
      <div class="self-topbar-title">
        <span>{{ title }}</span>
      </div>
      <a-menu v-model:selectedKeys="basicLayoutState.selectedTopKeys" theme="dark" mode="horizontal" :style="{ lineHeight: '64px' }">
        <a-menu-item v-for="menuItem in basicLayoutState.menus" :key="menuItem.name"><custom-icon :component="menuItem.meta.icon" style="margin-right: 4px" />{{ menuItem.meta.title }}</a-menu-item>
      </a-menu>
    </a-layout-header>
    <a-layout style="padding: 0 4px">
      <a-layout-sider width="240" style="background: #fff; min-height: 100%; padding: 24px 0">
        <a-menu v-model:selectedKeys="basicLayoutState.selectedSideKeys" v-model:openKeys="basicLayoutState.openSideKeys" @select="handleMenuSelect" mode="inline" style="height: 100%">
          <template v-for="menuItem in basicLayoutState.sideMenus">
            <!-- 没有子菜单 -->
            <a-menu-item v-if="!menuItem.children || menuItem.children.length <= 0" :key="menuItem.name">
              <!-- <user-outlined /> -->
              <custom-icon :component="menuItem.meta.icon" style="margin-right: 4px" />{{ menuItem.meta.title }}
            </a-menu-item>
            <!-- 有子菜单 -->
            <a-sub-menu v-else :key="menuItem.name">
              <template #title>
                <span>
                  <!-- <laptop-outlined /> -->
                  <custom-icon :component="menuItem.meta.icon" style="margin-right: 4px" />{{ menuItem.meta.title }}
                </span>
              </template>
              <a-menu-item v-for="subMenuItem in menuItem.children" :key="subMenuItem.name"><custom-icon :component="subMenuItem.meta.icon" style="margin-right: 4px" />{{ subMenuItem.meta.title }}</a-menu-item>
            </a-sub-menu>
          </template>
        </a-menu>
      </a-layout-sider>
      <div class="page-container">
        <a-breadcrumb style="margin: 16px 0">
          <a-breadcrumb-item v-for="matchedRoute in basicLayoutState.currentMatchedRoutes" :key="matchedRoute.name">{{ matchedRoute.meta.title }}</a-breadcrumb-item>
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
import { useRoute, useRouter } from 'vue-router';
// import routes from '../router';
import defaultSettings from '@/config/defaultSettings';
import store from '@/store'

import CustomIcon from '@/components/CustomIcon'

interface BasicLayoutState {
  title: string;
  selectedTopKeys: Array<string>;
  selectedSideKeys: Array<string>;
  openSideKeys: Array<string>;
  menus: Array<any>;
  currentMatchedRoutes: Array<any>;
  sideMenus: Array<any>;
}

export default defineComponent({
  name: 'BasicLayout',
  components: {
    CustomIcon,
  },
  setup() {
    const router = useRouter();
    const route = useRoute()

    const mainMenus = store.state.permission.addRouters;
    const routes = mainMenus.find((item: any) => item.path === '/')
    // Variables defination
    const basicLayoutState = reactive<BasicLayoutState>({
      title: defaultSettings.title,
      selectedTopKeys: [],
      selectedSideKeys: Array<string>(),
      openSideKeys: Array<string>(),
      menus: (routes && routes.children) || Array<any>(),
      currentMatchedRoutes: Array<any>(),
      sideMenus: Array<any>(),
    });
    // functions
    const handleMenuSelect = (obj: any) => {
      const { keyPath } = obj;
      for (let i = basicLayoutState.sideMenus.length - 1; i >= 0; i--) {
        if (basicLayoutState.sideMenus[i].name === keyPath[0]) {
          if (keyPath.length === 1) {
            router.push({ path: basicLayoutState.sideMenus[i].path });
          } else if (keyPath.length > 1) {
            for (let j = basicLayoutState.sideMenus[i].children.length - 1; j >= 0; j--) {
              if (basicLayoutState.sideMenus[i].children[j].name === keyPath[1]) {
                router.push({ path: basicLayoutState.sideMenus[i].children[j].path });
              }
            }
          }
        }
      }
    };

    const handleMenusData = (route: any) => {
      const { matched } = route;
      basicLayoutState.currentMatchedRoutes = matched;
      if (matched.length >= 2) {
        let matchedTopMenu = matched[1];
        basicLayoutState.selectedTopKeys = [matchedTopMenu.name];
        let matchedTopRouter = basicLayoutState.menus.filter((item) => item.name === matchedTopMenu.name)[0]
        basicLayoutState.sideMenus = matchedTopRouter?.children || []
        basicLayoutState.selectedSideKeys = [matched[matched.length - 1].name]
        basicLayoutState.openSideKeys = [];
        if (matched.length > 3) {
          matched.forEach((matchedItem: any, matchedIndex: number) => {
            if (matchedIndex > 1 && matchedIndex < matched.length - 1) {
              basicLayoutState.openSideKeys.push(matchedItem.name)
            }
          })
        }
      }
    };

    handleMenusData(route); // Deal with refresh page

    // Life cycles
    onMounted(() => {
      router.afterEach((to: any, from: any) => {
        const { matched } = to;
        basicLayoutState.currentMatchedRoutes = matched;
        if (matched.length >= 1) {
          basicLayoutState.selectedSideKeys = [matched[matched.length - 1].name];
          if (matched.length > 1) {
            const matchedTopMenu = matched[1]
            basicLayoutState.selectedTopKeys = [matchedTopMenu.name]
            const matchedTopRouter = basicLayoutState.menus.filter((item: any) => item.name === matchedTopMenu.name)[0]
            basicLayoutState.sideMenus = matchedTopRouter?.children || []
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
