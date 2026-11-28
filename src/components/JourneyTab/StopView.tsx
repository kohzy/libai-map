import { Toolbar, ToolbarButton } from '@ui-sdk/react/toolbar'
import type { Dispatch } from 'react'
import PanelScroll from '@/components/PanelScroll/PanelScroll'
import { stops } from '@/itinerary'
import { age, hasPoem } from '@/itinerary/poems'
import type { JourneyAction } from '@/journey/useJourney'
import styles from './JourneyTab.module.css'
import Spine from './Spine'

type StopViewProps = {
  index: number
  dispatch: Dispatch<JourneyAction>
}

function ChevronIcon({ direction }: { direction: 'left' | 'right' }) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      aria-hidden="true"
    >
      <path d={direction === 'left' ? 'M15 6l-6 6 6 6' : 'M9 6l6 6-6 6'} />
    </svg>
  )
}

function StopView({ index, dispatch }: StopViewProps) {
  const stop = stops[index]
  const p = stop.properties
  const last = index >= stops.length - 1
  const next = stops[last ? 0 : index + 1]

  return (
    <>
      <div className={styles.stopBar}>
        <Toolbar aria-label="Stop navigation" className={styles.toolbar}>
          <ToolbarButton
            className={styles.backButton}
            onClick={() => dispatch({ type: 'showIndex' })}
          >
            <ChevronIcon direction="left" />
            All stops
          </ToolbarButton>
          <span className={styles.counter}>
            Stop {index + 1} of {stops.length}
          </span>
          <ToolbarButton
            aria-label="Previous stop"
            className={styles.iconButton}
            onClick={() => dispatch({ type: 'step', action: 'prev' })}
          >
            <ChevronIcon direction="left" />
          </ToolbarButton>
          <ToolbarButton
            aria-label="Next stop"
            className={styles.iconButton}
            onClick={() => dispatch({ type: 'step', action: 'next' })}
          >
            <ChevronIcon direction="right" />
          </ToolbarButton>
        </Toolbar>
        <Spine
          index={index}
          onSelect={(i) => dispatch({ type: 'openStop', index: i })}
        />
      </div>

      <PanelScroll label={p.title}>
        <article className={styles.stop}>
          <header className={styles.stopHeader}>
            <p className={styles.when}>
              <span className={styles.year}>{p.year}</span>
              <span className={styles.age}>Li Bai is {age(stop)}</span>
            </p>
            <h2 className={styles.stopTitle}>{p.title}</h2>
          </header>

          {p.thumbnail && (
            <img className={styles.thumbnail} src={p.thumbnail} alt={p.title} />
          )}

          <dl className={styles.facts}>
            <dt>Then</dt>
            <dd>{p['historic-name']}</dd>
            <dt>Now</dt>
            <dd>{p['modern-name']}</dd>
            {p.companion && p.companion.length > 0 && (
              <>
                <dt>With</dt>
                <dd>{p.companion.join(', ')}</dd>
              </>
            )}
          </dl>

          {hasPoem(stop) && (
            <button
              type="button"
              className={styles.poemCard}
              onClick={() => dispatch({ type: 'openPoem', index })}
            >
              <span className={styles.poemCardTitle}>
                {p['poem-trans-title-hajin-en']}
              </span>
              <span lang="zh-Hans" className={styles.poemCardZh}>
                {p['poem-notable-title-zh-cn']}
              </span>
              <span className={styles.poemCardAction}>Read the poem</span>
            </button>
          )}

          <button
            type="button"
            className={styles.nextCard}
            onClick={() => dispatch({ type: 'step', action: 'next' })}
          >
            <span className={styles.nextLabel}>
              {last ? 'Back to the start' : 'Next stop'}, {next.properties.year}
            </span>
            <span className={styles.nextTitle}>{next.properties.title}</span>
          </button>
        </article>
      </PanelScroll>
    </>
  )
}

export default StopView
