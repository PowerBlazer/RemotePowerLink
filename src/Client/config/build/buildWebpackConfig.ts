import { BuildOptions } from './types/config';
import { Configuration } from 'webpack';
import { buildPlugins } from './buildPlugin';
import { buildLoaders } from './buildLoaders';
import { buildResolvers } from './buildResolvers';
import { buildDevServer } from './buildDevServer';

export function buildWebpackConfig (options: BuildOptions): Configuration {
    const { mode, paths } = options;

    return {
        mode,
        entry: paths.entry,
        output: {
            filename: '[name].[contenthash].js',
            path: paths.build,
            clean: true
        },
        plugins: buildPlugins(options),
        module: {
            rules: buildLoaders(options)
        },
        resolve: buildResolvers(options),
        devtool: 'source-map',
        devServer: buildDevServer(options)
    }
}
