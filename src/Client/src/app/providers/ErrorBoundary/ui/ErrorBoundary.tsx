import React, { ErrorInfo, ReactNode, Suspense } from 'react';
import { ErrorPage } from 'pages/ErrorPage';

interface ErrorBoundaryProps {
    children: ReactNode;
}

interface ErrorBoundaryState {
    hasError: boolean;
    error: Error | null
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
    constructor (props: ErrorBoundaryProps) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError (error: Error) {
        return { hasError: true };
    }

    componentDidCatch (error: Error, info: ErrorInfo) {
        this.setState({ error });
       
        console.log(error, info);
    }

    render () {
        const { hasError, error } = this.state;
        const { children } = this.props;

        if (hasError) {
            return (
                <Suspense fallback="">
                    <ErrorPage error={error?.message}/>
                </Suspense>
            )
        }

        return children;
    }
}

export default ErrorBoundary;
