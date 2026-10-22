"use client";

import { unstable_rethrow } from "next/navigation";
import { Component, type ReactNode } from "react";

type Props = {
  /** Gets a `reset` that clears the error and renders the children again. */
  fallback: (reset: () => void) => ReactNode;
  children: ReactNode;
};

type State = { error: unknown };

/**
 * Catches a section that failed to load so only that section shows an
 * error, not the whole page. React only offers error boundaries as class
 * components, hence the class. Next's notFound() and redirect() are thrown
 * on to Next untouched: they're navigation, not failures.
 */
export class SectionErrorBoundary extends Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: unknown): State {
    return { error };
  }

  reset = () => this.setState({ error: null });

  render() {
    if (this.state.error !== null) {
      unstable_rethrow(this.state.error);
      return this.props.fallback(this.reset);
    }
    return this.props.children;
  }
}
