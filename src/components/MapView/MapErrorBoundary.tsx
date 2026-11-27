import { Component } from 'react'
import type { ReactNode } from 'react'
import styles from './MapView.module.css'

type Props = { children: ReactNode }
type State = { failed: boolean }

class MapErrorBoundary extends Component<Props, State> {
  state: State = { failed: false }

  static getDerivedStateFromError(): State {
    return { failed: true }
  }

  render() {
    if (!this.state.failed) return this.props.children
    return (
      <div className={styles.wrapper}>
        <div className={styles.message}>
          <p>The map couldn't load.</p>
          <button type="button" onClick={() => window.location.reload()}>
            Reload
          </button>
        </div>
      </div>
    )
  }
}

export default MapErrorBoundary
