/**
 * 系统管理接口mock
 * v0.0.1 2023/02/28 gqd 菜单管理接口mock;
 *        2023/02/28 gqd Use export module;
 */
import Mock from 'mockjs2';
import { sysManageApi } from '@/api/sys';
import { asyncRouterMap } from '@/config/router.config';

/**
 * 平铺菜单列表
 */
const menuList = (params: any) => {
  function generateMenuListMock(arr: Array<any>, parentId: any) {
    let retArr: Array<any> = [];
    arr.forEach((item, index) => {
      let menuId = `${parentId}${index}`;
      retArr.push({
        createUserId: null,
        createTime: '2021-11-19 13:47:00',
        updateUserId: null,
        updateTime: null,
        status: 1,
        remark: null,
        id: menuId,
        name: item.name,
        menuName: item.meta.title,
        parentName: null,
        parentId: parentId,
        orderNum: '6',
        path: item.path,
        component: null,
        isFrame: '0',
        isCache: '1',
        menuType: 'C',
        visible: '1',
        icon: null,
        permissionId: item.name,
        // children: [],
      });
      if (item.children && item.children.length > 0) {
        retArr = retArr.concat(generateMenuListMock(item.children, menuId));
      }
    });
    return retArr;
  }
  const menuArr = generateMenuListMock(asyncRouterMap[0].children, 0);
  const res = {
    status: '0',
    data: menuArr,
    total: menuArr.length,
    message: '成功',
  };
  return res;
};

/**
 * 根绝角色查询菜单：树形菜单列表
 */
const menuListByRole = (params: any) => {
  function generateMenuListMock(arr: Array<any>, parentId: any) {
    let retArr: Array<any> = [];
    arr.forEach((item: any, index: number) => {
      let menuId = item.name;
      let tempMenu = {
        id: item.name,
        name: item.name,
        type: 'C',
        remark: null,
        level: 1,
        parentId: parentId,
        orderNo: '6',
        createdBy: null,
        createdTime: '2021-11-19 13:47:00',
        lastModifiedBy: null,
        lastModifiedTime: null,
        isDeleted: 0,
        status: 1,
        menuName: item.meta.title,
        parentName: null,
        path: item.path,
        component: null,
        isFrame: '0',
        isCache: '1',
        visible: '1',
        icon: null,
        // children: [],
        childList: Array<any>(),
      };
      if (item.children && item.children.length > 0) {
        tempMenu.childList = generateMenuListMock(item.children, menuId);
      }
      retArr.push(tempMenu);
    });
    return retArr;
  }
  const menuArr = generateMenuListMock(asyncRouterMap[0].children, null);
  const res = {
    status: '0',
    data: menuArr,
    total: menuArr.length,
    message: '成功',
  };
  return res;
};

/**
 * 菜单管理操作接口
 */
const actionMenuInfo = (params: any) => {
  const res = Mock.mock({
    status: '0',
    data: [],
    message: '成功',
  });
  return res;
};

/**
 * 角色列表
 */
const roleList = (params: any) => {
  function generateMenuListMock(arr: Array<any>, parentId: any) {
    let retArr: Array<any> = [];
    arr.forEach((item, index) => {
      let menuId = `${parentId}${index}`;
      retArr.push({
        createUserId: null,
        createTime: '2021-11-19 13:47:00',
        updateUserId: null,
        updateTime: null,
        status: 1,
        remark: null,
        id: menuId,
        menuId: item.name,
        menuCode: item.name,
        menuName: item.meta.title,
        parentName: null,
        parentId: parentId,
        orderNum: '6',
        path: item.path,
        component: null,
        isFrame: '0',
        isCache: '1',
        menuType: 'C',
        visible: '1',
        icon: null,
        // children: [],
      });
      if (item.children && item.children.length > 0) {
        retArr = retArr.concat(generateMenuListMock(item.children, menuId));
      }
    });
    return retArr;
  }
  const menuArr = generateMenuListMock(asyncRouterMap[0].children, 0);
  const res = Mock.mock({
    status: '0',
    'data|10': [
      {
        roleId: '@id()',
        roleName: '@cword(5)',
        remark: '@cword(10)',
        'type|1': ['1', '2', '3'],
        createTime: '@datetime()',
        menuIds: menuArr.map((item) => item.menuId),
      },
    ],
    total: 20,
    message: '成功',
  });
  return res;
};

/**
 * 角色管理操作接口
 */
const actionRoleInfo = (params: any) => {
  const res = Mock.mock({
    status: '0',
    data: [],
    message: '成功',
  });
  return res;
};

export default () => {
  // menu
  Mock.mock(sysManageApi.menuList, 'post', menuList);
  // Mock.mock(sysManageApi.menuAdd, 'post', actionMenuInfo)
  // Mock.mock(sysManageApi.menuUpdate, 'post', actionMenuInfo)
  // Mock.mock(sysManageApi.menuDelete, 'post', actionMenuInfo)
  Mock.mock(sysManageApi.menuListByRole + '?roleId=01', 'get', menuListByRole);
  // role
  // Mock.mock(sysManageApi.roleList, 'post', roleList)
  // Mock.mock(sysManageApi.roleAdd, 'post', actionRoleInfo)
  // Mock.mock(sysManageApi.roleUpdate, 'post', actionRoleInfo)
  // Mock.mock(sysManageApi.roleDelete, 'post', actionRoleInfo)
};
