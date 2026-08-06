import styles from './Nav.module.css'

export default function Nav() {
  return (
    <header className={styles.header}>
      <div className={styles.marqueeWrap}>
        <span className={styles.marquee}>
          ✦ SAM BURWOOD ✦ GEOMETRIC ABSTRACT ART ✦ SHEFFIELD ✦ INSPIRED BY LIFE ✦ &nbsp;
          ✦ SAM BURWOOD ✦ GEOMETRIC ABSTRACT ART ✦ SHEFFIELD ✦ INSPIRED BY LIFE ✦ &nbsp;
        </span>
      </div>
      <div className={styles.titleBar}>
        <span className={styles.title}>SAM BURWOOD</span>
        <span className={styles.subtitle}>☆ GEOMETRIC ABSTRACT ART ☆</span>
      </div>
    </header>
  )
}
