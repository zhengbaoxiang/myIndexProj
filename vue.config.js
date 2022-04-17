const path = require('path')

function resolve(dir) {
    return path.join(__dirname, dir)
}

const publicPath = process.env.VUE_APP_PUBLIC_PATH
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer')

module.exports = {
    publicPath: publicPath,
    productionSourceMap: false, // 生产环境是否生成 sourceMap 文件
    chainWebpack: (config) => {
        config.resolve.alias
            .set('@', resolve('src')) // key,value自行定义，比如.set('@@', resolve('src/components'))
            .set('_c', resolve('src/components'))
    },
    // 反向代理
    devServer: {
        open: true, // 自动打开浏览器
        port: 5210,
        disableHostCheck: true,
        proxy: {
            '/baiduApi': {
                target: 'https://aip.baidubce.com',
                changeOrigin: true,
                pathRewrite: {
                    '^/baiduApi': ''
                }
            }
        }
    },

    // 若要兼容ie11则打开此项 ,调整 webpack 配置
    configureWebpack: {
        module: {
            rules: [
                // 'transform-runtime' 插件告诉 Babel
                // 要引用 runtime 来代替注入。
                {
                    test: /\.m?js$/,
                    include: [
                        resolve('src'),
                        resolve('test'),
                        resolve('node_modules/webpack-dev-server/client'),
                        resolve('node_modules/iview/src'),
                    ],
                    use: {
                        loader: 'babel-loader',
                        options: {
                            presets: ['@babel/preset-env']
                        }
                    }
                }
            ]
        },
        plugins :[
            // new BundleAnalyzerPlugin() // 分析打包大小使用默认配置         

        ]
    }
}
