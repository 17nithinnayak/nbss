import { Component } from "react";

export class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, info) {
    // Surface it in the console too, in case the on-screen message gets missed.
    console.error("Render error caught by ErrorBoundary:", error, info);
  }

  componentDidUpdate(prevProps) {
    // If the route changed while we were showing an error, clear it so the
    // new page gets a real chance to render instead of showing a stale crash
    // from whatever page broke earlier.
    if (prevProps.resetKey !== this.props.resetKey && this.state.error) {
      this.setState({ error: null });
    }
  }

  render() {
    if (this.state.error) {
      return (
        <div className="max-w-xl mx-auto px-6 py-10">
          <div className="border-2 border-red-300 bg-red-50 rounded-lg p-5">
            <p className="text-sm font-medium text-red-800 mb-2">
              Something broke while rendering this page.
            </p>
            <pre className="text-xs text-red-700 whitespace-pre-wrap break-words">
              {String(this.state.error?.message || this.state.error)}
            </pre>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
