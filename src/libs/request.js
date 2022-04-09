/*
 * @Date: 2022-04-07 11:16:03
 * @LastEditors: zbx
 * @LastEditTime: 2022-04-08 15:49:30
 * @FilePath: \management\src\libs\request.js
 */
import axios from '@/libs/axios'

const request = opts => {
    return new Promise((resolve, reject) => {
        axios.request(opts).then(res => {
            if (res.data && res.data.code) {
               if (res.data.code === 200 || res.data.code === '000') {
                    resolve(res.data);
                } else {
                    reject(res.data);
                }
            } else {
                resolve(res);
            }
        }).catch(error => {
            console.log(error)
            reject({
                code: '999',
                msg: opts.msg || '请求失败，请重试',
                data: error
            });
        });
    });
}
export default request
