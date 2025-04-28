import React from "react"
type LogLevel = "debug" | "info" | "warn" | "error"

type LogEntry = {
  level: LogLevel
  message: string
  timestamp: Date
  context?: Record<string, any>
}

class Logger {
  private logs: LogEntry[] = []
  private maxLogs = 1000

  constructor() {
    // Clear old logs periodically
    setInterval(() => {
      if (this.logs.length > this.maxLogs) {
        this.logs = this.logs.slice(-this.maxLogs)
      }
    }, 60000) // Every minute
  }

  log(level: LogLevel, message: string, context?: Record<string, any>) {
    const entry: LogEntry = {
      level,
      message,
      timestamp: new Date(),
      context,
    }

    this.logs.push(entry)

    // Log to console in development
    if (process.env.NODE_ENV !== "production") {
      const consoleMethod =
        level === "error"
          ? console.error
          : level === "warn"
            ? console.warn
            : level === "info"
              ? console.info
              : console.debug

      consoleMethod(`[${entry.timestamp.toISOString()}] [${level.toUpperCase()}] ${message}`, context)
    }

    // In production, we would send critical errors to an error tracking service
    if (level === "error" && process.env.NODE_ENV === "production") {
      this.reportToErrorService(entry)
    }
  }

  debug(message: string, context?: Record<string, any>) {
    this.log("debug", message, context)
  }

  info(message: string, context?: Record<string, any>) {
    this.log("info", message, context)
  }

  warn(message: string, context?: Record<string, any>) {
    this.log("warn", message, context)
  }

  error(message: string, context?: Record<string, any>) {
    this.log("error", message, context)
  }

  getRecentLogs(count = 100, level?: LogLevel): LogEntry[] {
    let filteredLogs = this.logs

    if (level) {
      filteredLogs = filteredLogs.filter((log) => log.level === level)
    }

    return filteredLogs.slice(-count).reverse()
  }

  private reportToErrorService(entry: LogEntry) {
    // In a real implementation, this would send the error to a service like Sentry
    // For now, we'll just log it
    console.error("Would report to error service:", entry)

    // Example implementation with Sentry would be:
    // Sentry.captureException(new Error(entry.message), {
    //   extra: entry.context,
    //   level: entry.level,
    // })
  }
}

// Create a singleton instance
export const logger = new Logger()

// Error boundary for client components
export function withErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  fallback: React.ReactNode,
): React.ComponentType<P> {
  return function ErrorBoundaryWrapper(props: P) {
    return (
      <ErrorBoundary fallback={fallback}>
        <Component {...props} />
      </ErrorBoundary>
    )
  }
}

class ErrorBoundary extends React.Component<
  { children: React.ReactNode; fallback: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: React.ReactNode; fallback: React.ReactNode }) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(_: Error) {
    return { hasError: true }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    logger.error("React error boundary caught error", {
      error: error.toString(),
      componentStack: errorInfo.componentStack,
    })
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback
    }

    return this.props.children
  }
}
