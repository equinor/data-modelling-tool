import React from 'react'

// https://reactjs.org/docs/error-boundaries.html
class ErrorBoundary extends React.Component {
  constructor(props: any) {
    super(props)
    //@ts-ignore
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: any) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true }
  }

  componentDidCatch(error: any, errorInfo: any) {
    // You can also log the error to an error reporting service
    console.error(error, errorInfo)
  }

  render() {
    //@ts-ignore
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return <h1>Something went wrong.</h1>
    }

    //@ts-ignore
    return this.props.children
  }
}

export default ErrorBoundary
