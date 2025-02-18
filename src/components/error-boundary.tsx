import { Component } from "react";

export class ErrorBoundary extends Component<{
  fallback?: React.ComponentType<{ error: Error }> | React.ReactNode;
  children: React.ReactNode;
}> {
  state = {
    hasError: false,
    error: null as Error | null,
  };

  componentDidCatch(error: Error) {
    console.error(error);
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  render() {
    const { fallback: Fallback } = this.props;
    const { hasError, error } = this.state;

    if (hasError)
      return Fallback === undefined ? (
        <p className="error">ERROR!</p>
      ) : typeof Fallback === "function" ? (
        <Fallback error={error!} />
      ) : (
        <>{Fallback}</>
      );

    return this.props.children;
  }
}

export const withErrorBoundary = <C extends React.ComponentType<any>>(
  Comp: C,
  fallback?: React.ComponentType<{ error: Error }> | React.ReactNode,
) =>
  function ErrorBoundaryWrap(props: React.ComponentProps<C>) {
    return (
      <ErrorBoundary fallback={fallback}>
        <Comp {...props} />
      </ErrorBoundary>
    );
  };
