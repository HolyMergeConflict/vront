import React from "react";

export default class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { error: any }
> {
  constructor(props: any) {
    super(props);
    this.state = { error: null };
  }
  static getDerivedStateFromError(error: any) {
    return { error };
  }
  componentDidCatch(error: any, info: any) {
    console.error("UI error:", error, info);
  }
  render() {
    if (this.state.error) {
      return (
        <div className="mx-auto max-w-xl rounded-xl border bg-red-50 p-4 text-sm text-red-800">
          <div className="font-medium">Произошла ошибка в интерфейсе</div>
          <pre className="mt-2 overflow-auto whitespace-pre-wrap">
            {String(this.state.error?.message || this.state.error)}
          </pre>
        </div>
      );
    }
    return this.props.children as any;
  }
}
