/**
 * 常量
 * v1.0.0 2022/02/25 gqd New File;
 *        2022/03/10 gqd 增加正则;
 *        2022/04/14 gqd 增加管理员类型;
 * v1.5.0 2022/12/22 gqd 增加测试人员批量上传最大任务数;
 */
export default {
    theme: 'light', // 项目整体主题
    REQUEST_STATUS_SUCCESS: '0',
    MODAL_TYPE: {
        ADD: 'A',
        MODIFY: 'M',
        DELETE: 'D',
    },
    REGEXP: { // 正则表达式常量：包含手机号、邮箱等
        PHONE: /^1(3([0-35-9]\d|4[1-8])|4[14-9]\d|5([0-35689]\d|7[1-79])|66\d|7[2-35-8]\d|8\d{2}|9[13589]\d)\d{7}$/,
        MAIL: /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/,
    },
    ROLE_TYPE: {
        SUPER: '01',
        ALL_NET: '02',
        PROVINCE: '03',
        REGION: '60',
    },
};
