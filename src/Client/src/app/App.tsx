import { useTheme } from 'app/providers/ThemeProvider';
import { classNames } from 'shared/lib/classNames/classNames';
import { AppRouter } from 'app/providers/router';
import React, { Suspense } from 'react';
import { Toaster } from 'react-hot-toast';
import './styles/index.scss';
import { ErrorBoundary } from 'app/providers/ErrorBoundary';

export default function App () {
    const { theme } = useTheme();

    return (
        <div className={classNames('app', {}, [theme])}>
            <ErrorBoundary>
                <Suspense fallback="">
                    <div className='content-page'>
                        <AppRouter/>
                        <Toaster
                            position="top-center"
                            reverseOrder={false}
                            gutter={2}
                            toastOptions={{
                                className: 'notification',
                                duration: 2000
                            }}
                        />
                    </div>
                </Suspense>
            </ErrorBoundary>
        </div>
    )
}
