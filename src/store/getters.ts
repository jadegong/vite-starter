/*
 * @Author: gqd
 * @Date: <2023-02-23 Thu>
 * @LastEditTime: <2023-02-23 Thu>
 * @LastEditors: gqd
 * @Description: In User Settings Edit
 * @FilePath: /src/store/getters.js
 *
 * v1.0.0 2022/03/08 gqd 增加证件类型，省份列表;
 *        2022/03/15 gqd 增加卡状态列表;
 */

const getters = {
  // 全量字典
  dictData: (state: any) => {
    const dictData = {};
    state.publicStore.dictData.forEach((item: any) => {
      if (!dictData[item.dictType]) {
        dictData[item.dictType] = [];
      }
      dictData[item.dictType].push(item);
    });
    return dictData;
  },
  user: (state: any) => state.user.info,
  addRouters: (state: any) => state.permission.addRouters,
};

export default getters;
