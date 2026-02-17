import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

/**
 * WBS-5.3 — Route/component-level error boundary for document rendering.
 * Catches runtime errors in document viewers and shows a fallback UI
 * with retry and diagnostic context.
 */
class DocumentErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null, errorInfo: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        this.setState({ errorInfo });
        // WBS-TD-CQ-03: Telemetry hook point
        console.error(
            `[DocumentErrorBoundary] ${this.props.context || 'Unknown context'}:`,
            error,
            errorInfo
        );
    }

    handleRetry = () => {
        this.setState({ hasError: false, error: null, errorInfo: null });
    };

    render() {
        if (this.state.hasError) {
            return (
                <div className="flex flex-col items-center justify-center h-full min-h-[300px] gap-4 p-6 text-center bg-muted/20 rounded-lg border border-border">
                    <div className="w-14 h-14 rounded-full bg-red-500/10 flex items-center justify-center">
                        <AlertTriangle className="w-7 h-7 text-red-500" />
                    </div>
                    <div>
                        <h3 className="text-base font-semibold text-foreground mb-1">
                            {this.props.title || 'Preview Failed'}
                        </h3>
                        <p className="text-sm text-muted-foreground max-w-md">
                            {this.props.message ||
                                'Something went wrong while rendering this document. Try reloading or contact support if the problem persists.'}
                        </p>
                    </div>
                    <div className="flex gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={this.handleRetry}
                            className="gap-2"
                        >
                            <RefreshCw className="w-4 h-4" />
                            Retry
                        </Button>
                        {this.props.onDownloadFallback && (
                            <Button
                                variant="default"
                                size="sm"
                                onClick={this.props.onDownloadFallback}
                            >
                                Download Instead
                            </Button>
                        )}
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default DocumentErrorBoundary;
