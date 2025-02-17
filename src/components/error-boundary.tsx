import { Component } from "react";

export class ErrorBoundary extends Component {
  state = {
    hasError: false,
    error: null,
  };

  componentDidCatch(error) {
    console.error(error);
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  render() {
    const { fallback: Fallback } = this.props;
    const { hasError, error } = this.state;

    if (hasError)
      return Fallback !== undefined ? (
        <Fallback error={error} />
      ) : (
        <p className="error">ERROR!</p>
      );

    return this.props.children;
  }
}

export const withErrorBoundary = (Comp, fallback) =>
  function ErrorBoundaryWrap(props) {
    return (
      <ErrorBoundary fallback={fallback}>
        <Comp {...props} />
      </ErrorBoundary>
    );
  };
