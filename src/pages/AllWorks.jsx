import { useState } from 'react'
import { Link } from 'react-router-dom'
import { artworks, categories } from '../data/artworks'
import styles from './AllWorks.module.css'

export default function AllWorks() {
  const [activeCategory, setActiveCategory] = useState('All')

  const filtered = activeCategory === 'All'
    ? artworks
    : artworks.filter(a => a.category === activeCategory)

  return (
    <main className={styles.main}>
      <div className={styles.header}>
        <div className={styles.sectionLabel}>♥ ALL WORKS ♥</div>
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
          <Link key={work.id} to={`/works/${work.id}`} className={styles.cell}>
            <img src={work.thumb} alt={work.title} loading="lazy" />
            <div className={styles.cellOverlay}>
              <span className={styles.cellCategory}>{work.title}</span>
            </div>
          </Link>
        ))}
      </div>
    </main>
  )
}
