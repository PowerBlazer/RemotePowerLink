import { AboutPage } from 'pages/AboutPage'
import { LoginPage } from 'pages/LoginPage'
import { MainPage } from 'pages/MainPage'
import { NotFoundPage } from 'pages/NotFoundPage'
import { RouteProps } from 'react-router-dom'
import { SignupPage } from 'pages/SignupPage';
import RegistrationProvider from 'app/providers/RegistrationProvider/ui/RegistrationProvider';

export enum AppRoutes {
    MAIN = 'main',
    ABOUT = 'about',
    NOT_FOUND = 'not_found',
    LOGIN = 'login',
    SIGNUP = 'signup'
}

export const RoutePath: Record<AppRoutes, string> = {
    [AppRoutes.MAIN]: '/',
    [AppRoutes.ABOUT]: '/about',
    [AppRoutes.NOT_FOUND]: '*',
    [AppRoutes.LOGIN]: '/login',
    [AppRoutes.SIGNUP]: '/signup'
}

export const routeConfig: Record<AppRoutes, RouteProps> = {
    [AppRoutes.MAIN]: {
        path: RoutePath.main,
        element: <MainPage />
    },
    [AppRoutes.ABOUT]: {
        path: RoutePath.about,
        element: <AboutPage />
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
        element:
            <RegistrationProvider>
                <SignupPage/>
            </RegistrationProvider>
    }
}
