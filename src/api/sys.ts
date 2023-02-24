/**
 * 新系统管理接口
 * v0.0.1 2023/02/24 gqd 菜单接口;
 *        2022/04/08 gqd 角色接口;
 */
import request from '@/utils/request';
import { baseUrl } from '@/api/config';

export const sysManageApi = {
  // 菜单管理
  menuList: baseUrl + '/sysAuthority/all',
  menuListByRole: baseUrl + '/sysAuthority/getByRole',
};

export function queryMenuListByRole(parameter: any) {
  return request({
    url: sysManageApi.menuListByRole,
    method: 'post',
    params: parameter,
  });
}
