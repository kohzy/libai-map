import styles from './PanelHeader.module.css'

type PanelHeaderProps = {
  title: string
  subheader: string
  bookPage: number
}

function PanelHeader({ title, subheader, bookPage }: PanelHeaderProps) {
  return (
    <header className={styles.header}>
      <div className={styles.titleBlock}>
        <h1 className={styles.title}>{title}</h1>
        <p className={styles.subheader}>{subheader}</p>
      </div>
      <div className={styles.pageBlock}>
        <p className={styles.page}>pg {bookPage}</p>
      </div>
    </header>
  )
}

export default PanelHeader
