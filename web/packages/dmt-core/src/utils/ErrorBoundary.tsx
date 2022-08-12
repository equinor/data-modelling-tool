import React, { ReactNode } from 'react'

export class ErrorBoundary extends React.Component<any, { hasError: boolean }> {
  fallBack: () => ReactNode = () => (
    <h4 style={{ color: 'red' }}>This component crashed...</h4>
  )

  constructor(props: { fallBack: () => ReactNode }) {
    super(props)
    this.fallBack = props.fallBack
    this.state = { hasError: false }
  }

  static getDerivedStateFromError() {
    // Update state so the next render will show the fallback UI.
    return {
      hasError: true,
    }
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return this.fallBack()
    }
    return this.props.children
  }
}
