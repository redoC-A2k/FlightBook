const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');
// const dotenv = require('dotenv')

// dotenv.config()
console.log(process.env.REACT_APP_BACKEND)
console.log(process.env.REACT_APP_FRONTEND)

module.exports = {
    entry: './src/index.tsx',
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist')
    },
    module: {
        rules: [{
            test: /\.(ts|tsx)$/,
            exclude: /node_modules/,
            use: 'babel-loader'
        },
        {
            test: /\.css$/i,
            use: ["style-loader","css-loader"],
        },
        {
            test: /\.(jpg|jpeg|png|gif|mp3|svg)$/,
            use: ["file-loader"],
        }],
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './src/index.html'
        }),
        new webpack.DefinePlugin({
            'process.env': {
                REACT_APP_BACKEND: JSON.stringify(process.env.REACT_APP_BACKEND),
                REACT_APP_FRONTEND: JSON.stringify(process.env.REACT_APP_FRONTEND)
            }
        })
    ],    
    resolve: {
        extensions: ['.tsx', '.ts', '.js']
    }
};
// {
//     test: /\.tsx?$/,
//     exclude: /node_modules/,
//     loader: 'ts-loader'
//  }