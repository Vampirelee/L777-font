const path = require('path');
module.exports = {
    // 选项...
    configureWebpack: {
        resolve: {
            alias: {
                '@css': path.resolve(__dirname, 'src/common/css'), // 基础css样式地址
                '@src': path.resolve(__dirname, 'src'), // src根地址
                '@assets': path.resolve(__dirname, 'src/assets'), // 静态资源地址
                '@js': path.resolve(__dirname, 'src/common/js'), // 常用方法地址
            }
        }
    }

};