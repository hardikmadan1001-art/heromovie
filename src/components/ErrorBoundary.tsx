import React, { Component, useEffect } from 'react';
import { useStore } from '../store/useStore';

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return this.props.fallback || this.renderDefaultFallback();
    }

    return this.props.children;
  }

  private renderDefaultFallback() {
    const { setPhase, phase } = useStore();
    
    // Only show reset button if we're in a scene phase (not during loading)
    const canReset = phase !== 'preload';

    return (
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          backgroundColor: '#05050a',
          color: '#f5f3ee',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 99999,
          fontFamily: 'monospace',
          textAlign: 'center',
          padding: '20px',
        }}
      >
        <div style={{ 
          fontSize: '0.7rem', 
          letterSpacing: '0.3em', 
          textTransform: 'uppercase', 
          opacity: 0.5,
          marginBottom: '20px'
        }}>
          Something went wrong
        </div>
        
        <div style={{ 
          fontSize: '0.8rem', 
          opacity: 0.7,
          marginBottom: '40px',
          maxWidth: '400px',
          lineHeight: '1.6'
        }}>
          {this.state.error?.message || 'An unexpected error occurred'}
        </div>

        {canReset && (
          <button
            onClick={() => {
              this.handleReset();
              setPhase('void');
            }}
            style={{
              cursor: 'pointer',
              padding: '12px 24px',
              backgroundColor: 'transparent',
              border: '1px solid rgba(245, 243, 238, 0.5)',
              color: '#f5f3ee',
              fontSize: '0.7rem',
              letterSpacing: '0.3em',
              textTransform: 'uppercase',
              transition: 'all 0.3s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(245, 243, 238, 0.1)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
          >
            Return to Void
          </button>
        )}

        <div style={{ 
          marginTop: '30px',
          fontSize: '0.5rem',
          opacity: 0.3,
          letterSpacing: '0.2em',
        }}>
          Press F5 to refresh
        </div>
      </div>
    );
  }
}

// Hook to use error boundary reset functionality
export const useErrorBoundary = () => {
  const resetError = React.useCallback(() => {
    throw new Error('useErrorBoundary must be used within an ErrorBoundary');
  }, []);

  return { resetError };
};
