import { Component } from 'react';

/** Shows a fallback instead of a blank page if rendering throws. */
export default class ErrorBoundary extends Component {
  state = { error: null };

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, info) {
    console.error('Unexpected error:', error, info.componentStack);
  }

  render() {
    if (!this.state.error) return this.props.children;
    return (
      <div role="alert" style={{ padding: 32, textAlign: 'center', lineHeight: 1.5 }}>
        <h1 style={{ fontSize: 28, marginBottom: 12 }}>Something went wrong.</h1>
        <p style={{ marginBottom: 16 }}>Reload the page to try again.</p>
        <button
          type="button"
          onClick={() => window.location.reload()}
          style={{ padding: '8px 16px', borderRadius: 8, background: '#6B77E5', color: '#fff', cursor: 'pointer' }}
        >
          Reload
        </button>
      </div>
    );
  }
}
