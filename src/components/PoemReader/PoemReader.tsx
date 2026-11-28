import { useEffect, useRef, useState } from 'react'
import type { KeyboardEvent, PointerEvent } from 'react'
import ChevronIcon from '@/components/Icon/ChevronIcon'
import { matchesQuery } from '@/hooks/useMediaQuery'
import type { Stop } from '@/itinerary'
import { groupOf } from '@/itinerary/poems'
import type { PoemLanguage } from '@/itinerary/poems'
import styles from './PoemReader.module.css'

type PoemReaderProps = {
  stop: Stop
  onPrev: () => void
  onNext: () => void
  onClose: () => void
}

const VISIBLE_ZH_LINES = 4

function prefersReducedMotion() {
  return matchesQuery('(prefers-reduced-motion: reduce)')
}

function PoemReader({ stop, onPrev, onNext, onClose }: PoemReaderProps) {
  const firstButton = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    const opener =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null
    firstButton.current?.focus()
    return () => {
      // The opener can be inside a sheet that is still reopening, so wait a frame.
      requestAnimationFrame(() => {
        if (opener?.isConnected) opener.focus()
      })
    }
  }, [])

  const onKeyDown = (event: KeyboardEvent) => {
    if (event.key === 'Escape') {
      event.preventDefault()
      onClose()
    }
  }

  return (
    <section
      aria-label="Poem reader"
      className={styles.reader}
      onKeyDown={onKeyDown}
    >
      <div className={styles.bar}>
        <button
          ref={firstButton}
          type="button"
          aria-label="Previous poem"
          className={styles.iconButton}
          onClick={onPrev}
        >
          <ChevronIcon direction="left" />
        </button>
        <button
          type="button"
          aria-label="Next poem"
          className={styles.iconButton}
          onClick={onNext}
        >
          <ChevronIcon direction="right" />
        </button>
        <span className={styles.spacer} />
        <button type="button" className={styles.closeButton} onClick={onClose}>
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.75"
            strokeLinecap="round"
            aria-hidden="true"
          >
            <path d="M6 6l12 12M18 6L6 18" />
          </svg>
          Close
        </button>
      </div>
      <PoemBody key={stop.properties.title} stop={stop} />
    </section>
  )
}

function PoemBody({ stop }: { stop: Stop }) {
  const p = stop.properties
  const zh = p['poem-notable-zh-cn'] ?? []
  const en = p['poem-trans-hajin-en'] ?? []

  const [hoverGroup, setHoverGroup] = useState<number | null>(null)
  const [focusGroup, setFocusGroup] = useState<number | null>(null)
  const [tapGroup, setTapGroup] = useState<number | null>(null)
  const shown = hoverGroup ?? focusGroup ?? tapGroup

  const zhLines = useRef<(HTMLParagraphElement | null)[]>([])

  const revealZh = (group: number) => {
    const line = zh.findIndex((_, i) => groupOf(stop, 'zh', i) === group)
    zhLines.current[line]?.scrollIntoView({
      block: 'nearest',
      inline: 'nearest',
      behavior: prefersReducedMotion() ? 'auto' : 'smooth',
    })
  }

  const lineProps = (lang: PoemLanguage, line: number) => {
    const group = groupOf(stop, lang, line)
    return {
      tabIndex: 0,
      'data-paired': shown === group || undefined,
      'data-dimmed': (shown !== null && shown !== group) || undefined,
      onPointerEnter: (event: PointerEvent) => {
        if (event.pointerType === 'touch') return
        setHoverGroup(group)
        if (lang === 'en') revealZh(group)
      },
      onPointerLeave: (event: PointerEvent) => {
        if (event.pointerType !== 'touch') setHoverGroup(null)
      },
      onPointerUp: (event: PointerEvent) => {
        if (event.pointerType === 'touch')
          setTapGroup((current) => (current === group ? null : group))
      },
      onFocus: () => {
        setFocusGroup(group)
        if (lang === 'en') revealZh(group)
      },
      onBlur: () => setFocusGroup(null),
    }
  }

  const clearTapOutsideLines = (event: PointerEvent) => {
    if (
      event.pointerType === 'touch' &&
      !(event.target as HTMLElement).closest('[data-line]')
    )
      setTapGroup(null)
  }

  const moreLines = zh.length - VISIBLE_ZH_LINES

  return (
    <div className={styles.scroll} onPointerDown={clearTapOutsideLines}>
      <div className={styles.body}>
        <div className={styles.columns}>
          <div className={styles.zhColumn}>
            <div
              lang="zh-Hans"
              className={styles.zh}
              tabIndex={0}
              role="region"
              aria-label={`${p['poem-notable-title-zh-cn']}, ${zh.length} lines`}
            >
              <h3 className={styles.zhTitle}>
                {p['poem-notable-title-zh-cn']}
              </h3>
              {zh.map((text, i) => (
                <p
                  key={`${i}:${text}`}
                  ref={(el) => {
                    zhLines.current[i] = el
                  }}
                  data-line=""
                  className={styles.zhLine}
                  {...lineProps('zh', i)}
                >
                  {text}
                </p>
              ))}
            </div>
            {moreLines > 0 && (
              <p className={styles.hint}>
                <ChevronIcon direction="left" size={14} />
                Scroll left for {moreLines} more lines
              </p>
            )}
          </div>

          <div className={styles.enColumn}>
            <h2 className={styles.enTitle}>{p['poem-trans-title-hajin-en']}</h2>
            <div className={styles.enLines}>
              {en.map((text, i) => (
                <p
                  key={`${i}:${text}`}
                  data-line=""
                  className={styles.enLine}
                  {...lineProps('en', i)}
                >
                  {text}
                </p>
              ))}
            </div>
            <p className={styles.credit}>Translated by Ha Jin</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PoemReader
