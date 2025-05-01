const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyPlugin = require('copy-webpack-plugin')

const config = {
    entry: {
        background: './src/background.js',
        render: './src/render.js'
    },
    output: {
        filename: '[name].js',
        path: path.resolve(__dirname, 'dist')
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './src/index.html',
            filename: 'index.html'
        }),
        new CopyPlugin({
            patterns: [
                {
                    from: 'public'
                }
            ]
        })
    ],
    optimization: {
        minimize: true
    }
}


module.exports = (env, argv) => {

    if (argv.mode === "development") {
        config["optimization"]["minimize"] = false
    }

    return config
}