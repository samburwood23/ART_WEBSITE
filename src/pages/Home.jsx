import { Link } from 'react-router-dom'
import Carousel from '../components/Carousel'
import Scratch from '../components/Scratch'
import { featured } from '../data/artworks'
import styles from './Home.module.css'

const captionColors = [styles.captionPink, styles.captionOrange, styles.captionTeal, styles.captionMustard]

export default function Home() {
  return (
    <main className={styles.main}>
      <section className={styles.hero}>
        <div className={styles.heroText}>
          <Scratch className={styles.scratch} />
          <h1 className={styles.headline}>
            <span>GEOMETRIC</span>
            <span className={styles.linePink}>ABSTRACT</span>
            <span className={styles.lineOrange}>ART</span>
          </h1>
          <p className={styles.blurb}>Art that took longer than it looks.</p>
          <div className={styles.heroButtons}>
            <a href="#work" className={styles.primaryBtn}>SEE THE WORK ↓</a>
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
              <span className={`${styles.caption} ${captionColors[i % captionColors.length]}`}>{work.title}</span>
            </Link>
          ))}
        </div>
        <div className={styles.galleryLink}>
          <Link to="/gallery" className={styles.galleryBtn}>BROWSE THE GALLERY</Link>
        </div>
      </section>
    </main>
  )
}
