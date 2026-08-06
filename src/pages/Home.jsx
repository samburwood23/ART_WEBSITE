import { Link } from 'react-router-dom'
import { artworks } from '../data/artworks'
import styles from './Home.module.css'

const featured = artworks.filter(a => a.category === 'Painting').slice(0, 6)

export default function Home() {
  return (
    <main className={styles.main}>
      <section className={styles.hero}>
        <h1 className={styles.name}>Sam Burwood</h1>
        <p className={styles.tagline}>Geometric abstract art. Inspired by life.</p>
      </section>

      <section className={styles.grid}>
        {featured.map(work => (
          <Link to="/gallery" key={work.id} className={styles.cell}>
            <img src={work.thumb} alt="" loading="lazy" />
          </Link>
        ))}
      </section>

      <div className={styles.cta}>
        <Link to="/gallery" className={styles.ctaLink}>View full gallery →</Link>
      </div>
    </main>
  )
}
