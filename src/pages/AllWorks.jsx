import { useState } from 'react'
import { artworks, categories } from '../data/artworks'
import styles from './AllWorks.module.css'

export default function AllWorks() {
  const [activeCategory, setActiveCategory] = useState('All')

  const filtered = activeCategory === 'All'
    ? artworks
    : artworks.filter(a => a.category === activeCategory)

  const [lightbox, setLightbox] = useState(null)

  return (
    <main className={styles.main}>
      <div className={styles.header}>
        <div className={styles.sectionLabel}>✦ ALL WORKS ✦</div>
        <div className={styles.filters}>
          {['All', ...categories].map(cat => (
            <button
              key={cat}
              className={`${styles.filter} ${activeCategory === cat ? styles.filterActive : ''}`}
              onClick={() => setActiveCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className={styles.grid}>
        {filtered.map(work => (
          <div key={work.id} className={styles.cell} onClick={() => setLightbox(work)}>
            <img src={work.thumb} alt="" loading="lazy" />
            <div className={styles.cellOverlay}>
              <span className={styles.cellCategory}>{work.category}</span>
            </div>
          </div>
        ))}
      </div>

      {lightbox && (
        <div className={styles.lightbox} onClick={() => setLightbox(null)}>
          <button className={styles.close} onClick={() => setLightbox(null)}>✕ CLOSE</button>
          <img src={lightbox.src} alt="" onClick={e => e.stopPropagation()} />
        </div>
      )}

      <footer className={styles.footer}>
        <span>✦ SAM BURWOOD ✦ SHEFFIELD ✦ {new Date().getFullYear()} ✦</span>
      </footer>
    </main>
  )
}
