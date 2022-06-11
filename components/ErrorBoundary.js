import { Component } from 'react';

export class ErrorBoundary extends Component {
  state = {
    hasError: null,
  };

  componentDidCatch(error) {
    console.error(error);
  }

  static getDerivedStateFromError(_error) {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError)
      return this.props.fallback !== undefined ? (
        this.props.fallback
      ) : (
        <p className="error">ERROR!</p>
      );

    return this.props.children;
  }
}

export const withErrorBoundary = (Comp, fallback) => {
  const ErrorBoundaryWrap = (props) => (
    <ErrorBoundary fallback={fallback}>
      <Comp {...props} />
    </ErrorBoundary>
  );
  return ErrorBoundaryWrap;
};
