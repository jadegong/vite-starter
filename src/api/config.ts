/*
 * @Author: gqd
 * @Date: 2023/02/23
 * @LastEditTime: 2023/02/23
 * @LastEditors: Please set LastEditors
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: /onelinkui-pro-vue/src/api/config.js
 */
import request from '@/utils/request'
const baseUrl = '/api' // 开发

const apiConfig = {
    upload: baseUrl + '/upload'
}

function customRequest(url: string, type: string, parameter = {}, path: any, id: any) {
    if (path) url += `/${path}`
    if (id) url += `/${id}`

    let obj
    if (type === 'get') {
        obj = {
            url: url,
            method: type,
            params: parameter
        }
    } else {
        obj = {
            url: url,
            method: type,
            headers: { 'Content-Type': 'application/json;charset=UTF-8' },
            data: parameter
        }
    }
    return request(obj)
}

export { baseUrl, apiConfig, customRequest }
