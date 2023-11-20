const config = {
    initialTime: '2024-01-01',
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
            url: 'https://tjupt.org/torrents.php',
            picName: 'bg (3).jpg',
            title: '北洋园PT'
        },
        {
            id: 3,
            dataId: 4,
            url: 'https://tjupt.org/torrents.php',
            picName: 'bg (4).jpg',
            title: '北洋园PT'
        },
        {
            id: 4,
            dataId: 5,
            url: 'https://www.taobao.com/',
            picName: 'bg (5).jpg',
            title: '淘宝'
        },
        {
            id: 5,
            dataId: 6,
            url: 'https://console.bce.baidu.com/ai/#/ai/ocr/overview/index',
            picName: 'bg (6).jpg',
            title: '百度智能云'
        },
        {
            id: 6,
            dataId: 7,
            url: 'https://console.bce.baidu.com/ai/#/ai/ocr/overview/index',
            picName: 'bg (7).jpg',
            title: '百度智能云'
        },
        {
            id: 7,
            dataId: 8,
            url: 'https://console.bce.baidu.com/ai/#/ai/ocr/overview/index',
            picName: 'bg (8).jpg',
            title: '百度智能云'
        },
        {
            id: 8,
            dataId: 9,
            url: 'https://console.bce.baidu.com/ai/#/ai/ocr/overview/index',
            picName: 'bg (9).jpg',
            title: '百度智能云'
        },
        {
            id: 9,
            dataId: 10,
            url: 'https://console.bce.baidu.com/ai/#/ai/ocr/overview/index',
            picName: 'bg (10).jpg',
            title: '百度智能云'
        },
        {
            id: 10,
            dataId: 11,
            url: 'https://tjupt.org/torrents.php',
            picName: 'bg (11).jpg',
            title: '北洋园PT'
        },
        {
            id: 10,
            dataId: 12,
            url: 'https://tjupt.org/torrents.php',
            picName: 'bg (12).jpg',
            title: '北洋园PT'
        },
        {
            id: 10,
            dataId: 13,
            url: 'https://tjupt.org/torrents.php',
            picName: 'bg (13).jpg',
            title: '北洋园PT'
        },
        {
            id: 10,
            dataId: 14,
            url: 'https://tjupt.org/torrents.php',
            picName: 'bg (14).jpg',
            title: '北洋园PT'
        },
        {
            id: 10,
            dataId: 15,
            url: 'https://tjupt.org/torrents.php',
            picName: 'bg (15).jpg',
            title: '北洋园PT'
        },
    ],

    // api请求基础路径
    baseUrl: process.env.VUE_APP_BASE_APIURL,
    // 页面服务器的基础路径
    publicPath: process.env.VUE_APP_PUBLIC_PATH,
    // 前端服务器的域名
    serviceHost: process.env.VUE_APP_SERVICE_HOST || '/'
}

export default config
