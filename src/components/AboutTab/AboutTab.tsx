import {
  Accordion,
  AccordionHeader,
  AccordionItem,
  AccordionPanel,
  AccordionTrigger,
} from '@ui-sdk/react/accordion'
import type { ReactNode } from 'react'
import PanelScroll from '@/components/PanelScroll/PanelScroll'
import styles from './AboutTab.module.css'

function Section({
  value,
  title,
  children,
}: {
  value: string
  title: string
  children: ReactNode
}) {
  return (
    <AccordionItem value={value} className={styles.item}>
      <AccordionHeader className={styles.header}>
        <AccordionTrigger className={styles.trigger}>
          {title}
          <svg
            className={styles.chevron}
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.75"
            strokeLinecap="round"
            aria-hidden="true"
          >
            <path d="M6 9l6 6 6-6" />
          </svg>
        </AccordionTrigger>
      </AccordionHeader>
      <AccordionPanel className={styles.panel}>{children}</AccordionPanel>
    </AccordionItem>
  )
}

function AboutTab() {
  return (
    <PanelScroll label="About this map">
      <div className={styles.about}>
        <Accordion defaultValue={['book']} className={styles.accordion}>
          <Section value="book" title="The book">
            <p>
              <em>The Banished Immortal: A Life of Li Bai</em> is Ha Jin's
              biography of the Tang poet, published by Pantheon in 2019.
            </p>
            <p>
              It follows Li Bai from his birth in Suyab, in what is now
              Kyrgyzstan, through decades of wandering, seeking office and
              writing, to his death in Dangtu in 762. The English translations
              of the poems on this map are Ha Jin's, from the book.
            </p>
            <p>
              The map is a companion for reading it, not a summary. It tracks
              where Li Bai was, not the routes he took between stops.
            </p>
          </Section>
          <Section value="maker" title="Who made it">
            <p>
              Kohzy collected these 39 stops by hand while reading the book, to
              keep track of where Li Bai was from chapter to chapter.
            </p>
            <p>
              [A line or two about you: what you do, and where people can find
              you.]
            </p>
            <p>
              The code and the stop data are on{' '}
              <a href="https://github.com/kohzy/libai-map">GitHub</a>.
            </p>
          </Section>
          <Section value="colophon" title="Colophon">
            <dl className={styles.colophon}>
              <dt>Type</dt>
              <dd>
                Newsreader for titles and translations, Instrument Sans for the
                interface, Noto Serif SC for the poems in Chinese
              </dd>
              <dt>Map</dt>
              <dd>Mapbox, with map data from OpenStreetMap contributors</dd>
              <dt>Stops</dt>
              <dd>
                Places and companions from the book. Coordinates from Wikipedia.
                Page numbers follow the 2019 paperback.
              </dd>
              <dt>Built with</dt>
              <dd>React, Vite and ui-sdk, hosted on Vercel</dd>
            </dl>
          </Section>
        </Accordion>
      </div>
    </PanelScroll>
  )
}

export default AboutTab
