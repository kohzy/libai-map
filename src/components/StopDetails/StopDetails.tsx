import {
  ScrollArea,
  ScrollAreaContent,
  ScrollAreaViewport,
} from '@ui-sdk/react/scroll-area'
import type { Stop } from '@/itinerary'
import styles from './StopDetails.module.css'

type StopDetailsProps = {
  stop: Stop
}

function Lines({ lines, className }: { lines: string[]; className: string }) {
  return lines.map((line) => (
    <p key={line} className={className}>
      {line}
    </p>
  ))
}

function StopDetails({ stop }: StopDetailsProps) {
  const p = stop.properties
  const poem = p['poem-notable-zh-cn']
  const translation = p['poem-trans-hajin-en']

  return (
    <ScrollArea className={styles.scrollArea}>
      <ScrollAreaViewport role="region" aria-label={p.title} className={styles.viewport}>
        <ScrollAreaContent className={styles.content}>
          <div className={styles.titleChunk}>
            <p className={styles.year}>
              {p.year}
              <span className={styles.ad}> AD</span>
            </p>
            <h2 className={styles.stopTitle}>{p.title}</h2>
          </div>

          {p.thumbnail && <img className={styles.thumbnail} src={p.thumbnail} alt={p.title} />}

          <div className={styles.columns}>
            <section className={styles.chunk}>
              <h3 className={styles.chunkHeader}>Historic Location Name</h3>
              <p className={styles.text}>{p['historic-name']}</p>
            </section>
            <section className={styles.chunk}>
              <h3 className={styles.chunkHeader}>Present Location Name</h3>
              <p className={styles.text}>{p['modern-name']}</p>
            </section>
          </div>

          {poem && (
            <div className={styles.columns}>
              <section className={styles.chunk} lang="zh">
                <h3 className={styles.chunkHeader}>Notable Poem</h3>
                <Lines lines={poem} className={styles.poemLine} />
                <p className={styles.poemTitle}>《{p['poem-notable-title-zh-cn']}》</p>
              </section>
              {translation && (
                <section className={styles.chunk}>
                  <h3 className={styles.chunkHeader}>Translated</h3>
                  <Lines lines={translation} className={styles.poemLine} />
                  <p className={styles.poemTitle}>"{p['poem-trans-title-hajin-en']}"</p>
                </section>
              )}
            </div>
          )}

          {p.companion && (
            <div className={styles.columns}>
              <section className={styles.chunk}>
                <h3 className={styles.chunkHeader}>Companion(s)</h3>
                <Lines lines={p.companion} className={styles.text} />
              </section>
            </div>
          )}
        </ScrollAreaContent>
      </ScrollAreaViewport>
    </ScrollArea>
  )
}

export default StopDetails
