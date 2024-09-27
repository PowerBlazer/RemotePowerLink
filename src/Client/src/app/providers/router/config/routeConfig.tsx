import { LoginPage } from 'pages/LoginPage'
import { MainPage } from 'pages/MainPage'
import { NotFoundPage } from 'pages/NotFoundPage'
import { RouteProps } from 'react-router-dom'
import { SignupPage } from 'pages/SignupPage';
import RegistrationProvider from 'app/providers/RegistrationProvider/ui/RegistrationProvider';
import { Navbar } from 'widgets/Navbar';
import { SftpPage } from 'pages/SftpPage';
import { SettingsPage } from 'pages/SettingsPage';
import { TerminalPage } from 'pages/TerminalPage';

export enum AppRoutes {
    MAIN = '/',
    NOT_FOUND = 'not_found',
    LOGIN = 'login',
    SIGNUP = 'signup',
    SFTP = 'sftp',
    SETTINGS = 'settings',
    TERMINAL = 'terminal'
}

export const RoutePath: Record<AppRoutes, string> = {
    [AppRoutes.MAIN]: '/',
    [AppRoutes.NOT_FOUND]: '*',
    [AppRoutes.LOGIN]: '/login',
    [AppRoutes.SIGNUP]: '/signup',
    [AppRoutes.SFTP]: '/sftp',
    [AppRoutes.SETTINGS]: '/settings',
    [AppRoutes.TERMINAL]: '/terminal'
}

export const routeConfig: Record<AppRoutes, RouteProps> = {
    [AppRoutes.MAIN]: {
        path: RoutePath['/'],
        element: <MainPage/>
    },
    [AppRoutes.NOT_FOUND]: {
        path: RoutePath.not_found,
        element: <NotFoundPage />
    },
    [AppRoutes.LOGIN]: {
        path: RoutePath.login,
        element: <LoginPage/>
    },
    [AppRoutes.SIGNUP]: {
        path: RoutePath.signup,
        element: <RegistrationProvider>
            <SignupPage/>
        </RegistrationProvider>
    },
    [AppRoutes.SFTP]: {
        path: RoutePath.sftp,
        element: <SftpPage/>
    },
    [AppRoutes.SETTINGS]: {
        path: RoutePath.settings,
        element: <SettingsPage/>
    },
    [AppRoutes.TERMINAL]: {
        path: RoutePath.terminal,
        element: <TerminalPage/>
    }
}

export function getAppRouteFromPath (path: string): AppRoutes | undefined {
    // Перебираем ключи и значения объекта RoutePath
    for (const key of Object.keys(RoutePath) as AppRoutes[]) {
        if (RoutePath[key] === path) {
            return key;
        }
    }
    return undefined; // Если путь не найден, возвращаем undefined
}
