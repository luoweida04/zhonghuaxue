const {
  defineConfig
} = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  lintOnSave: false,
  // 配置代理
  devServer: {
    proxy: {
      '/api': {
        // target: 'http://www.ds-cncecsci.com',
        target: 'https://www.ds-cncecsci.com',
        // pathRewrite: {
        //   '^/api': ''
        // }, // 重写路径
        ws: false,
        changeOrigin: true
      }
    }
  }
})