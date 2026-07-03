import { Link } from 'react-router-dom'
import { artworks } from '../data/artworks'
import styles from './Home.module.css'

export default function Home() {
  const featured = artworks.slice(0, 3)

  return (
    <main>
      <section className={styles.hero}>
        <div className={styles.heroInner}>
          <p className={styles.heroEyebrow}>Artist</p>
          <h1 className={styles.heroTitle}>Sam<br />Burwood</h1>
          <p className={styles.heroSub}>
            Geometric abstract art. Inspired by life.
          </p>
          <Link to="/gallery" className={styles.heroCta}>View Gallery</Link>
        </div>
      </section>

      <section className={styles.featured}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>Selected Works</h2>
          <div className={styles.grid}>
            {featured.map(work => (
              <Link to="/gallery" key={work.id} className={styles.card}>
                <div className={styles.imgWrap}>
                  <img src={work.thumb} alt="" loading="lazy" />
                </div>
              </Link>
            ))}
          </div>
          <div className={styles.seeAll}>
            <Link to="/gallery" className={styles.textLink}>See all works →</Link>
          </div>
        </div>
      </section>
    </main>
  )
}
