var path = require('path');

module.exports = {
    mode: 'development',
    entry: './src/main.js',
    devtool: 'inline-source-map',
    output: {
    path: path.resolve(__dirname, 'evolve'),
        filename: 'main.js'
    }
};