import { Suspense } from 'react'
import { Routes, Route } from 'react-router-dom'
import { routeConfig } from 'app/providers/router';
import { PageLoader } from 'widgets/PageLoader/ui/PageLoader';
import {AppRoutes, RoutePath} from "app/providers/router/config/routeConfig";
import {NavbarBasic} from "widgets/NavbarBasic";
import {Navbar} from "widgets/Navbar";
import {classNames} from "shared/lib/classNames/classNames";


const navbarBasicPages: { path: string, route: AppRoutes }[] = [
    { path: RoutePath.login, route: AppRoutes.LOGIN },
    { path: RoutePath.signup, route: AppRoutes.SIGNUP }
];

export default function AppRouter () {
    const routes = Object.values(routeConfig).map(({path, element}) => {
        const isNavbarBasicPage = navbarBasicPages.some(item => item.path === path);
        
        return (
            <Route key={path} path={path} element={
                <div className={classNames("page-wrapper",{
                    "vertical": !isNavbarBasicPage
                })}>
                    {isNavbarBasicPage ? <NavbarBasic /> : <Navbar />}
                    {element}
                </div>
            }/>
        )
    })

    return (
        <Suspense fallback={<PageLoader/>}>
            <Routes>
                {routes}
            </Routes>
        </Suspense>
    )
}
