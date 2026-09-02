import { Link } from 'react-router-dom'
import Carousel from '../components/Carousel'
import { artworks } from '../data/artworks'
import styles from './Home.module.css'

const featured = artworks.filter(a => a.id >= 11 && a.id <= 18)

export default function Home() {
  return (
    <main className={styles.main}>
      <section className={styles.carouselSection}>
        <div className={styles.sectionLabel}>✦ FEATURED WORKS ✦</div>
        <Carousel images={featured} />
      </section>

      <section className={styles.gallerySection}>
        <div className={styles.sectionLabel}>✦ SELECTED WORKS ✦</div>
        <div className={styles.grid}>
          {featured.map(work => (
            <div key={work.id} className={styles.cell}>
              <img src={work.thumb} alt="" loading="lazy" />
              <div className={styles.cellOverlay}>
                <span className={styles.cellCategory}>{work.category}</span>
              </div>
            </div>
          ))}
        </div>
        <div className={styles.allWorksLink}>
          <Link to="/works" className={styles.allWorksBtn}>✦ VIEW ALL WORKS ✦</Link>
        </div>
      </section>

      <footer className={styles.footer}>
        <span>✦ SAM BURWOOD ✦ SHEFFIELD ✦ {new Date().getFullYear()} ✦</span>
      </footer>
    </main>
  )
}
