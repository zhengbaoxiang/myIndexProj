const config = {
    initialDataList: [
        {
            id: 0,
            dataId: 1,
            url: 'https://t.bilibili.com/',
            picName: 'bg (1).jpg',
            title: '哔哩哔哩'
        },
        {
            id: 1,
            dataId: 2,
            url: 'https://map.baidu.com/',
            picName: 'bg (2).jpg',
            title: '百度地图'
        },
        {
            id: 2,
            dataId: 3,
            url: 'https://element.eleme.cn/#/zh-CN/component/form',
            picName: 'bg (3).jpg',
            title: 'Element UI'
        },
        {
            id: 3,
            dataId: 4,
            url: 'https://github.com/zhenggenshuo?tab=repositories',
            picName: 'bg (4).jpg',
            title: 'github'
        },
        {
            id: 4,
            dataId: 5,
            url: 'https://cn.vuejs.org/v2/guide/installation.html',
            picName: 'bg (5).jpg',
            title: 'VUE官网'
        },
        {
            id: 5,
            dataId: 6,
            url: 'https://console.bce.baidu.com/ai/#/ai/ocr/overview/index',
            picName: 'bg (6).jpg',
            title: '百度智能云'
        },
        {
            id: 5,
            dataId: 6,
            url: 'https://tjupt.org/torrents.php',
            picName: 'bg (7).jpg',
            title: '北洋园PT'
        }
    ],

    // api请求基础路径
    baseUrl: process.env.VUE_APP_BASE_APIURL || '/',
    // 页面服务器的基础路径
    publicPath: process.env.VUE_APP_PUBLIC_PATH || '/',
    // 前端服务器的域名
    serviceHost: process.env.VUE_APP_SERVICE_HOST || '/', 
}

export default config
