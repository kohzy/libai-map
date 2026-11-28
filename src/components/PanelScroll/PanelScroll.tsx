import {
  ScrollArea,
  ScrollAreaContent,
  ScrollAreaViewport,
} from '@ui-sdk/react/scroll-area'
import type { ReactNode } from 'react'
import styles from './PanelScroll.module.css'

type PanelScrollProps = {
  label: string
  children: ReactNode
}

function PanelScroll({ label, children }: PanelScrollProps) {
  return (
    <ScrollArea className={styles.area}>
      <ScrollAreaViewport
        role="region"
        aria-label={label}
        className={styles.viewport}
      >
        <ScrollAreaContent className={styles.content}>
          {children}
        </ScrollAreaContent>
      </ScrollAreaViewport>
    </ScrollArea>
  )
}

export default PanelScroll
