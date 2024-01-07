import { useTheme } from 'app/providers/ThemeProvider';
import { classNames } from 'shared/lib/classNames/classNames';
import { AppRouter } from 'app/providers/router';
import { Suspense } from 'react';
import './styles/index.scss';
import {Navbar} from "widgets/Navbar";

export default function App () {
    const { theme } = useTheme();

    return (
        <div className={classNames('app', {}, [theme])}>
            <Suspense fallback="">
                <div className='content-page'>
                    <Navbar/>
                    <AppRouter/>
                </div>
            </Suspense>
        </div>
    )
}
