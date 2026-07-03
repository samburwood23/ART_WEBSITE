import styles from './About.module.css'

export default function About() {
  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <div className={styles.pageHeader}>
          <span className={styles.pageLabel}>About</span>
        </div>
        <div className={styles.grid}>
          <div className={styles.imageCol}>
            <div className={styles.imgWrap}>
              <img
                src="https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=600&q=80"
                alt="Sam Burwood"
              />
            </div>
          </div>
          <div className={styles.textCol}>
            <h1 className={styles.title}>Sam<br />Burwood</h1>
            <div className={styles.bio}>
              <p>
                Artist based in Sheffield. Working in oil, acrylic markers, and geometric abstraction.
              </p>
              <p>
                C in GCSE Art but god loves a trier.
              </p>
            </div>
            <div className={styles.details}>
              <div className={styles.detail}>
                <span className={styles.detailLabel}>Based in</span>
                <span>Sheffield</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
