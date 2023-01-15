var path = require('path');

module.exports = {
    mode: 'development',
    entry: './src/wiki/wiki.js',
    devtool: 'inline-source-map',
    output: {
    path: path.resolve(__dirname, 'wiki'),
        filename: 'wiki.js'
    }
};