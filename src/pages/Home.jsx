import Carousel from '../components/Carousel'
import { artworks } from '../data/artworks'
import styles from './Home.module.css'

export default function Home() {
  return (
    <main className={styles.main}>
      <section className={styles.carouselSection}>
        <div className={styles.sectionLabel}>✦ FEATURED WORKS ✦</div>
        <Carousel images={artworks} />
      </section>

      <section className={styles.gallerySection}>
        <div className={styles.sectionLabel}>✦ ALL WORKS ✦</div>
        <div className={styles.grid}>
          {artworks.map(work => (
            <div key={work.id} className={styles.cell}>
              <img src={work.thumb} alt="" loading="lazy" />
              <div className={styles.cellOverlay}>
                <span className={styles.cellCategory}>{work.category}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      <footer className={styles.footer}>
        <span>✦ SAM BURWOOD ✦ SHEFFIELD ✦ {new Date().getFullYear()} ✦</span>
      </footer>
    </main>
  )
}
