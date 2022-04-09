import request from '@/libs/request'

const baiduApi = {
    getToken: (params) => {
        // const url = 'https://aip.baidubce.com/oauth/2.0/toke'
        return request({
            url: `/baiduApi/oauth/2.0/token`,
            params: params,
            method: 'post',
            headers: {
                'Content-Type': 'application/x-www-from-urlencoded'
            }
        })
    },

    // 获取图像识别结果
    general_basic: (data, token) => {
        // const url = 'https://aip.baidubce.com/rest/2.0/ocr/v1/general?access_token=24.f9ba9c5241b67688bb4adbed8bc91dec.2592000.1485570332.282335-8574074'
        return request({
            url: `/baiduApi/rest/2.0/ocr/v1/general_basic?access_token=${token}`,
            data,
            method: 'post',
            headers: {
                'Content-Type': 'application/x-www-from-urlencoded'
            }
        })
    },
    // 高精度获取图像识别结果
    accurate_basic: (data, token) => {
        const url = `/baiduApi/rest/2.0/ocr/v1/accurate_basic?access_token=${token}`
        return request({
            url,
            data,
            method: 'post',
            headers: {
                'Content-Type': 'application/x-www-from-urlencoded'
            }
        })
    },
    // 高精度获取图像识别结果
    handwriting: (data, token) => {
        const url = `/baiduApi/rest/2.0/ocr/v1/handwriting?access_token=${token}`
        return request({
            url,
            data,
            method: 'post',
            headers: {
                'Content-Type': 'application/x-www-from-urlencoded'
            }
        })
    }
}
export { baiduApi }
