import { Link } from 'react-router-dom'
import Carousel from '../components/Carousel'
import { featured } from '../data/artworks'
import styles from './Home.module.css'

const captionColors = [styles.captionPink, styles.captionOrange, styles.captionRed]

export default function Home() {
  return (
    <main className={styles.main}>
      <section className={styles.hero}>
        <div className={styles.heroText}>
          <h1 className={styles.headline}>
            <span className={styles.linePink}>GEOMETRIC</span>
            <span className={styles.lineOrange}>ABSTRACT</span>
            <span className={styles.lineRed}>ART ☆</span>
          </h1>
          <p className={styles.blurb}>Art that took longer than it looks.</p>
          <div className={styles.heroButtons}>
            <a href="#work" className={styles.primaryBtn}>✦ SEE THE WORK</a>
            <Link to="/contact" className={styles.secondaryBtn}>COMMISSION ME</Link>
          </div>
        </div>
        <Carousel images={featured} />
      </section>

      <section id="work" className={styles.gallerySection}>
        <div className={styles.sectionLabel}>SELECTED WORKS</div>
        <div className={styles.grid}>
          {featured.map((work, i) => (
            <Link key={work.id} to={`/works/${work.id}`} className={styles.cell}>
              <div className={styles.thumb}>
                <img src={work.thumb} alt={work.title} loading="lazy" />
              </div>
              <span className={`${styles.caption} ${captionColors[i % 3]}`}>{work.title}</span>
            </Link>
          ))}
        </div>
      </section>
    </main>
  )
}
