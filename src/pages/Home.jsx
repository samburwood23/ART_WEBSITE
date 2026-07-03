import { Link } from 'react-router-dom'
import { artworks } from '../data/artworks'
import styles from './Home.module.css'

export default function Home() {
  const featured = artworks.slice(0, 3)

  return (
    <main>
      <section className={styles.hero}>
        <div className={styles.heroInner}>
          <p className={styles.heroEyebrow}>Artist — Sheffield</p>
          <h1 className={styles.heroTitle}>Sam<br />Burwood</h1>
          <p className={styles.heroSub}>
            Geometric abstract art. Inspired by life.
          </p>
          <Link to="/gallery" className={styles.heroCta}>View Gallery</Link>
        </div>
        <div className={styles.heroRight}>
          <div className={styles.heroRightTop} />
          <div />
        </div>
      </section>

      <section className={styles.featured}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionTitle}>Selected Works</span>
            <Link to="/gallery" className={styles.textLink}>See all →</Link>
          </div>
          <div className={styles.grid}>
            {featured.map(work => (
              <Link to="/gallery" key={work.id} className={styles.card}>
                <div className={styles.imgWrap}>
                  <img src={work.thumb} alt="" loading="lazy" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}
