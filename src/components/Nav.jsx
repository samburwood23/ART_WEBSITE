import styles from './Nav.module.css'

export default function Nav() {
  return (
    <header className={styles.header}>
      <div className={styles.marqueeWrap}>
        <span className={styles.marquee}>
          ✦ ART THAT TOOK LONGER THAN IT LOOKS ✦ SAM BURWOOD ✦ SHEFFIELD ✦ C IN GCSE ART ✦ &nbsp;
          ✦ ART THAT TOOK LONGER THAN IT LOOKS ✦ SAM BURWOOD ✦ SHEFFIELD ✦ C IN GCSE ART ✦ &nbsp;
        </span>
      </div>
      <div className={styles.titleBar}>
        <span className={styles.title}>SAM BURWOOD</span>
        <span className={styles.subtitle}>☆ GEOMETRIC ABSTRACT ART ☆</span>
      </div>
    </header>
  )
}
