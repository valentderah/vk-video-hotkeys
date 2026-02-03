const path = require('path')

const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyPlugin = require('copy-webpack-plugin')
const miniExtractPlugin = require('mini-css-extract-plugin')

const config = {
    entry: {
        background: './src/content/index.js',
        popup: './src/popup/index.js',
        style: './src/popup/style.scss'
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
                    from: 'public',
                    globOptions: {
                        ignore: ['**/images/banners/**']
                    }
                }
            ]
        }),
        new miniExtractPlugin()
    ],
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-react']
                    }
                }
            },
            {
                test: /\.(sa|sc|c)ss$/,
                use: [
                    miniExtractPlugin.loader,
                    'css-loader',
                    'sass-loader'
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