import { BuildOptions } from './types/config';
import type { Configuration as DevServerConfiguration } from 'webpack-dev-server';

export function buildDevServer (options: BuildOptions): DevServerConfiguration {
    return {
        port: options.port,
        open: false,
        historyApiFallback: true,
        hot: true,
        allowedHosts: ['188.225.57.132', 'power-messenger.ru'],
        host: '0.0.0.0'
    }
}
