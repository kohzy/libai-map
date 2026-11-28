import {
  Tabs,
  TabsIndicator,
  TabsList,
  TabsPanel,
  TabsTab,
} from '@ui-sdk/react/tabs'
import type { Dispatch } from 'react'
import AboutTab from '@/components/AboutTab/AboutTab'
import JourneyTab from '@/components/JourneyTab/JourneyTab'
import PoemsTab from '@/components/PoemsTab/PoemsTab'
import type { JourneyAction, JourneyState, Tab } from '@/journey/useJourney'
import { site } from '@/site'
import styles from './PanelContent.module.css'

type PanelContentProps = {
  state: JourneyState
  dispatch: Dispatch<JourneyAction>
  compact?: boolean
}

const TABS: { value: Tab; label: string }[] = [
  { value: 'journey', label: 'Journey' },
  { value: 'poems', label: 'Poems' },
  { value: 'about', label: 'About' },
]

function PanelContent({ state, dispatch, compact = false }: PanelContentProps) {
  return (
    <div className={styles.panel}>
      <header className={compact ? styles.headerCompact : styles.header}>
        <h1 className={compact ? styles.titleCompact : styles.title}>
          <button
            type="button"
            className={styles.home}
            title="Back to the start of the journey"
            onClick={() => dispatch({ type: 'goHome' })}
          >
            {site.title}
          </button>
        </h1>
        {!compact && (
          <p className={styles.subtitle}>
            Li Bai, 701 to 762, from Ha Jin's <em>The Banished Immortal</em>
          </p>
        )}
      </header>

      <Tabs
        className={styles.tabs}
        value={state.tab}
        onValueChange={(next) =>
          next && dispatch({ type: 'selectTab', tab: next as Tab })
        }
      >
        <TabsList aria-label="Panel" className={styles.list}>
          {TABS.map((tab) => (
            <TabsTab key={tab.value} value={tab.value} className={styles.tab}>
              {tab.label}
            </TabsTab>
          ))}
          <TabsIndicator className={styles.indicator} />
        </TabsList>
        <div className={styles.stack}>
          <TabsPanel value="journey" className={styles.tabPanel}>
            <JourneyTab state={state} dispatch={dispatch} />
          </TabsPanel>
          <TabsPanel value="poems" className={styles.tabPanel}>
            <PoemsTab state={state} dispatch={dispatch} />
          </TabsPanel>
          <TabsPanel value="about" className={styles.tabPanel}>
            <AboutTab />
          </TabsPanel>
        </div>
      </Tabs>
    </div>
  )
}

export default PanelContent
