/*
 * @Date: 2021-10-09 09:35:16
 * @LastEditors: zbx
 * @LastEditTime: 2022-02-22 16:22:58
 * @FilePath: \frontCode\src\libs\axios.js
 */
import axios from 'axios'
import { getToken } from '@/libs/util'
import config from '@/config'
const baseURL = config.baseUrl

class HttpRequest {
    constructor(baseUrl = baseURL) {
        this.baseUrl = baseUrl
        this.queue = {}
    }
    getInsideConfig() {
        const config = {
            baseURL: this.baseUrl,
            headers: {
                token: getToken()
            },
            withCredentials: true
        }
        return config
    }
    destroy(url) {
        delete this.queue[url]
    }
    interceptors(instance, url) {
        // 请求拦截
        instance.interceptors.request.use(
            (config) => {
                this.queue[url] = true
                return config
            },
            (error) => {
                return Promise.reject(error)
            }
        )
        // 响应拦截
        instance.interceptors.response.use(
            (res) => {
                this.destroy(url)
                const { data, status, headers } = res
                return {
                    data,
                    status,
                    headers
                }
            },
            (error) => {
                this.destroy(url)
                let errorInfo = error.response
                if (!errorInfo) {
                    const {
                        request: { statusText, status },
                        config
                    } = JSON.parse(JSON.stringify(error))
                    errorInfo = {
                        statusText,
                        status,
                        request: {
                            responseURL: config.url
                        }
                    }
                }
                return Promise.reject(error)
            }
        )
    }
    request(options) {
        const instance = axios.create()
        options = Object.assign(this.getInsideConfig(), options)
        this.interceptors(instance, options.url)
        return instance(options)
    }
}

// export default HttpRequest

// 简化代码，合并api.request.js 到此处
const MyAxios = new HttpRequest(baseURL)
export default MyAxios
