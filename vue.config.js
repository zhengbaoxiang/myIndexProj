
const path = require('path')
function resolve (dir) {
  return path.join(__dirname, dir)
}

module.exports = {
  productionSourceMap: false, // 生产环境是否生成 sourceMap 文件
  // 反向代理
  devServer: {
    disableHostCheck: true,
    proxy: {
      '/proxyName': {
        target: 'https://uploadfile.bizhizu.cn',
        pathRewrite: {
          '^/proxyName': ''
        }
      },

      '/v': {
        target: 'http://v.juhe.cn',
        pathRewrite: {
          '^/v': ''
        }
      },
      '/apis': {
        target: 'http://apis.juhe.cn',
        pathRewrite: {
          '^/apis': ''
        }
      }
    }
    //   //环境配置
    //   host: '192.168.1.53',
    //   port: 8080,
    //   https: false,
    //   hotOnly: false,
    //   open: true, //配置自动启动浏览器
    //   proxy: {
    //     // 配置多个代理(配置一个 proxy: 'http://localhost:4000' )
    //     // '/api': {
    //     //   target: 'http://192.168.1.248:9888',
    //     //   // target: 'http://192.168.1.4:8999',
    //     //   pathRewrite: {
    //     //     '^/api': '/api'
    //     //   }
    //     // }
    //   }

  },

  pluginOptions: {
    'style-resources-loader': {
      preProcessor: 'less',
      patterns: [
        // 下面这段是自己加的，根据自己文件的位置来修改
        path.resolve(__dirname, 'src/assets/var.less')
      ]
    }
  },
  // https://www.cnblogs.com/hanguidong/p/9416194.html
  configureWebpack: config => {
    config.resolve = {
      extensions: ['.js', '.vue', '.json', '.css'],
      alias: {
        vue$: 'vue/dist/vue.esm.js',
        '@': resolve('src')
      }
    }
  }
}
