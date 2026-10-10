import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './styles/index.css';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('CampusOne Runtime Error:', error, errorInfo);
  }

  handleReset = () => {
    localStorage.clear();
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#092d25',
          color: '#f7f8f3',
          fontFamily: 'system-ui, sans-serif',
          padding: '24px',
          textAlign: 'center'
        }}>
          <div style={{
            maxWidth: '500px',
            background: 'rgba(255, 255, 255, 0.08)',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            borderRadius: '24px',
            padding: '32px',
            boxShadow: '0 20px 40px rgba(0,0,0,0.4)'
          }}>
            <h1 style={{ fontSize: '22px', fontWeight: 'bold', marginBottom: '8px', color: '#a6f2d0' }}>
              CampusOne Interface Notice
            </h1>
            <p style={{ fontSize: '13px', color: '#cbdad0', marginBottom: '20px', lineHeight: 1.6 }}>
              A cached data conflict occurred in your browser session. Clicking below will reset your local cache to the clean demonstration data.
            </p>
            <div style={{
              background: 'rgba(0,0,0,0.3)',
              padding: '12px',
              borderRadius: '12px',
              fontSize: '11px',
              fontFamily: 'monospace',
              color: '#fca5a5',
              marginBottom: '24px',
              textAlign: 'left',
              overflowX: 'auto'
            }}>
              {this.state.error?.message || 'Component render exception'}
            </div>
            <button
              onClick={this.handleReset}
              style={{
                backgroundColor: '#13a879',
                color: '#061c18',
                fontWeight: 'bold',
                fontSize: '13px',
                padding: '12px 24px',
                borderRadius: '12px',
                border: 'none',
                cursor: 'pointer',
                boxShadow: '0 4px 12px rgba(19, 168, 121, 0.4)'
              }}
            >
              Reset Session & Reload CampusOne
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>,
);
