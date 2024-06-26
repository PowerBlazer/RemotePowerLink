import HtmlWebpackPlugin from 'html-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import { WebpackPluginInstance, DefinePlugin, HotModuleReplacementPlugin } from 'webpack';
import { BuildOptions } from './types/config';
import ReactRefreshWebpackPlugin from '@pmmmwh/react-refresh-webpack-plugin'
import CopyWebpackPlugin from 'copy-webpack-plugin';
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer';

export function buildPlugins ({ paths, isDev, apiHost }: BuildOptions): WebpackPluginInstance[] {
    const plugins = [
        new HtmlWebpackPlugin({
            template: paths.html
        }),
        new MiniCssExtractPlugin({
            filename: 'css/[name].[contenthash:8].css',
            chunkFilename: 'css/[name].[contenthash:8].css'
        }),
        new DefinePlugin({
            __IS_DEV__: JSON.stringify(isDev),
            'process.env.API_HOST': JSON.stringify(apiHost)
        }),
        new HotModuleReplacementPlugin(),
        new CopyWebpackPlugin({
            patterns: [
                { from: './public', to: '.', globOptions: { ignore: ['**/*index.html'] } }
            ]
        }),
        new ReactRefreshWebpackPlugin({
            overlay: false
        })
        // new BundleAnalyzerPlugin({
        //     analyzerMode: 'server',
        //     analyzerHost: 'localhost',
        //     analyzerPort: 8888
        // })
    ]

    return plugins;
}
