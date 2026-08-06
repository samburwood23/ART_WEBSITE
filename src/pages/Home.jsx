import { Link } from 'react-router-dom'
import { artworks } from '../data/artworks'
import styles from './Home.module.css'

const paintings = artworks.filter(a => a.category === 'Painting')
const markers = artworks.filter(a => a.category === 'Markers')

export default function Home() {
  return (
    <main className={styles.main}>
      <div className={styles.nameplate}>
        <span className={styles.nameplateText}>Sam Burwood — Geometric abstract art. Inspired by life.</span>
        <Link to="/gallery" className={styles.nameplateLink}>Gallery →</Link>
      </div>

      <div className={styles.mosaic}>
        {/* Large feature — first painting */}
        <Link to="/gallery" className={`${styles.cell} ${styles.cellLarge}`}>
          <img src={paintings[0]?.src} alt="" />
        </Link>

        {/* Stack of two on the right */}
        <div className={styles.cellStack}>
          <Link to="/gallery" className={styles.cell}>
            <img src={paintings[1]?.src} alt="" />
          </Link>
          <Link to="/gallery" className={styles.cell}>
            <img src={paintings[2]?.src} alt="" />
          </Link>
        </div>

        {/* Row of three */}
        <Link to="/gallery" className={styles.cell}>
          <img src={paintings[3]?.src} alt="" />
        </Link>
        <Link to="/gallery" className={styles.cell}>
          <img src={markers[0]?.src} alt="" />
        </Link>
        <Link to="/gallery" className={styles.cell}>
          <img src={paintings[4]?.src} alt="" />
        </Link>

        {/* Wide banner */}
        <Link to="/gallery" className={`${styles.cell} ${styles.cellWide}`}>
          <img src={paintings[5]?.src} alt="" />
        </Link>
        <Link to="/gallery" className={styles.cell}>
          <img src={markers[1]?.src} alt="" />
        </Link>

        {/* Bottom row */}
        <Link to="/gallery" className={styles.cell}>
          <img src={paintings[6]?.src} alt="" />
        </Link>
        <Link to="/gallery" className={styles.cell}>
          <img src={markers[2]?.src} alt="" />
        </Link>
        <Link to="/gallery" className={styles.cell}>
          <img src={paintings[7]?.src} alt="" />
        </Link>
      </div>
    </main>
  )
}
