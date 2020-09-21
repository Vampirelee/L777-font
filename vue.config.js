const path = require('path');
module.exports = {
    // 选项...
    configureWebpack: {
        resolve: {
            alias: {
                '@css': path.resolve(__dirname, 'src/common/css'),
            }
        }
    }

};