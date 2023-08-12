const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true
})

const webpack = require('webpack')
module.exports = {
  configureWebpack: {
    plugins: [
      new webpack.ProvidePlugin({
        $: 'jquery',
        jQuery: 'jquery',
        'windows.jQuery': 'jquery'
      })
    ]
  },
  // devServer: {
  //   port: 8080, // 本地服务端口号，如果端口号被占用，会自动提升1
  //   host: '0.0.0.0', //本地主机名， 127.0.0.1， 真机 0.0.0.0
  //   https: false, //不适应https协议
  //   open: true, //启动服务时自动打开浏览器访问
  //   proxy: {
  //     '/music_qyx': {
  //       target: 'http://localhost:81/music_qyx/api', //接口域名
  //       changeOrigin: true,             //是否跨域
  //       ws: true,                       //是否代理 websockets
  //       secure: true,                   //是否https接口
  //       pathRewrite: {                  //路径重置
  //         '^/music_qyx': ''
  //       }
  //     }
  //   }
  // },
  publicPath: './',//静态资源包打包为相对路径
  outputDir: 'dist',//输出文件
}
