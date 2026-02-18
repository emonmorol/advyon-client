import React from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

/**
 * WBS-TD-CQ-03 — Route-level error boundary.
 * Wraps page-level routes to catch render errors and show
 * a recovery UI instead of a white screen.
 *
 * Props:
 *  - routeName: string — identifier for telemetry
 *  - children: ReactNode — route content
 *  - onNavigateHome: () => void — optional handler to go to a safe page
 */
class RouteErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null, errorInfo: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        this.setState({ errorInfo });
        // Telemetry hook — send to observability backend when available
        console.error(
            `[RouteErrorBoundary] Route "${this.props.routeName || 'unknown'}" crashed:`,
            { error: error.message, stack: errorInfo?.componentStack },
        );
    }

    handleRetry = () => {
        this.setState({ hasError: false, error: null, errorInfo: null });
    };

    handleGoHome = () => {
        if (this.props.onNavigateHome) {
            this.props.onNavigateHome();
        } else {
            window.location.href = '/dashboard';
        }
    };

    render() {
        if (this.state.hasError) {
            return (
                <div className="flex flex-col items-center justify-center min-h-[60vh] gap-5 p-8 text-center">
                    <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center">
                        <AlertTriangle className="w-8 h-8 text-red-500" />
                    </div>
                    <div>
                        <h2 className="text-lg font-semibold text-foreground mb-1">
                            Something went wrong
                        </h2>
                        <p className="text-sm text-muted-foreground max-w-md">
                            An unexpected error occurred while loading this page.
                            You can try reloading or go back to the dashboard.
                        </p>
                    </div>
                    {/* Show error message in dev mode */}
                    {import.meta.env.DEV && this.state.error && (
                        <pre className="text-xs text-left text-red-400 bg-red-500/5 border border-red-500/20 rounded-lg p-3 max-w-lg overflow-auto max-h-32">
                            {this.state.error.message}
                        </pre>
                    )}
                    <div className="flex gap-3">
                        <button
                            onClick={this.handleRetry}
                            className="px-5 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition text-sm flex items-center gap-2"
                        >
                            <RefreshCw className="w-4 h-4" /> Retry
                        </button>
                        <button
                            onClick={this.handleGoHome}
                            className="px-5 py-2 bg-muted text-foreground rounded-lg hover:bg-muted/80 transition text-sm flex items-center gap-2"
                        >
                            <Home className="w-4 h-4" /> Dashboard
                        </button>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default RouteErrorBoundary;
