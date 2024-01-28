import { LoginPage } from 'pages/LoginPage'
import { MainPage } from 'pages/MainPage'
import { NotFoundPage } from 'pages/NotFoundPage'
import { RouteProps } from 'react-router-dom'
import { SignupPage } from 'pages/SignupPage';
import RegistrationProvider from 'app/providers/RegistrationProvider/ui/RegistrationProvider';
import { Navbar } from 'widgets/Navbar';

export enum AppRoutes {
    MAIN = 'main',
    NOT_FOUND = 'not_found',
    LOGIN = 'login',
    SIGNUP = 'signup'
}

export const RoutePath: Record<AppRoutes, string> = {
    [AppRoutes.MAIN]: '/',
    [AppRoutes.NOT_FOUND]: '*',
    [AppRoutes.LOGIN]: '/login',
    [AppRoutes.SIGNUP]: '/signup'
}

export const routeConfig: Record<AppRoutes, RouteProps> = {
    [AppRoutes.MAIN]: {
        path: RoutePath.main,
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
        element: <RegistrationProvider><SignupPage/></RegistrationProvider>
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
