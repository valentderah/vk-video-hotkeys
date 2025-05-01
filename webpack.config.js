const path = require('path')

const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyPlugin = require('copy-webpack-plugin')
const miniExtractPlugin = require('mini-css-extract-plugin')

const config = {
    entry: {
        background: './src/background.js',
        render: './src/render.js',
        style: './src/style.css'
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
        }),
        new miniExtractPlugin()
    ],
    module: {
        rules: [
            {
                test: /\.css$/,
                use: [
                    miniExtractPlugin.loader,
                    'css-loader'
                ]
            }
        ]
    },

    mode: "production",

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