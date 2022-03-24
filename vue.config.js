const {
  defineConfig
} = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true
})

const path = require('path');

function resolve(dir) {
  return path.join(__dirname, dir);
}

module.exports = {
  publicPath: './',
  devServer: {
    // can be overwritten by process.env.HOST
    host: '0.0.0.0',
    port: 8080
  },
  chainWebpack: config => {
    config.resolve.alias
      .set('@', resolve('src'))
      .set('src', resolve('src'))
      .set('common', resolve('src/common'))
      .set('components', resolve('src/components'));
  },
  pluginOptions: {
    electronBuilder: {
      //设置应用图片
      builderOptions: {
        win: {
          icon: './src/assets/logo.png'
        },
        mac: {
          icon: './src/assets/logo.png'
        },
        //设置App名称
        productName: 'elepub'
      }
    }
  },
  configureWebpack: {
    resolve: {
      // 如果确认需要node polyfill，设置resolve.fallback安装对应的依赖
      fallback: {
        crypto: require.resolve('crypto-browserify'),
        path: require.resolve('path-browserify'),
        url: require.resolve('url'),
        buffer: require.resolve('buffer/'),
        util: require.resolve('util/'),
        stream: require.resolve('stream-browserify/'),
        vm: require.resolve('vm-browserify')
      },
      // 如果确认不需要node polyfill，设置resolve.alias设置为false
      alias: {
        crypto: false
      }
    },
    externals: {
      'electron': 'require("electron")'
    },
    target: "electron-renderer"
  }
};
