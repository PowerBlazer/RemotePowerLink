import { useTheme } from 'app/providers/ThemeProvider';
import { classNames } from 'shared/lib/classNames/classNames';
import { AppRouter } from 'app/providers/router';
import React, { Suspense } from 'react';
import { Toaster } from 'react-hot-toast';
import './styles/index.scss';

export default function App () {
    const { theme } = useTheme();

    return (
        <div className={classNames('app', {}, [theme])}>
            <Suspense fallback="">
                <div className='content-page'>
                    <AppRouter/>
                    <Toaster
                        position="bottom-right"
                        reverseOrder={false}
                        gutter={8}
                        containerClassName=""
                        containerStyle={{}}
                        toastOptions={{
                            className: '',
                            duration: 3000
                        }}
                    />
                </div>
            </Suspense>
        </div>
    )
}
