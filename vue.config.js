
const path = require('path')
function resolve (dir) {
  return path.join(__dirname, dir)
}

module.exports = {
  productionSourceMap: false, // 生产环境是否生成 sourceMap 文件
  devServer: {
    disableHostCheck: true
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
