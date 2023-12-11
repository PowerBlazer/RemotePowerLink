import { Suspense } from 'react'
import { Routes, Route } from 'react-router-dom'
import { routeConfig } from 'app/providers/router';
import { PageLoader } from 'widgets/PageLoader/ui/PageLoader';

export default function AppRouter () {
    const routes = Object.values(routeConfig).map(({ path, element }) => (
        <Route key={path} path={path} element={
            <div className="page-wrapper">
                {element}
            </div>
        }/>
    ))

    return (
        <Suspense fallback={<PageLoader/>}>
            <Routes>
                {routes}
            </Routes>
        </Suspense>
    )
}
