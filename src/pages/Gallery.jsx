import { Link, useSearchParams } from 'react-router-dom'
import { artworks, categories } from '../data/artworks'
import styles from './Gallery.module.css'

export default function Gallery() {
  const [params, setParams] = useSearchParams()
  const active = categories.includes(params.get('medium')) ? params.get('medium') : categories[0]
  const filtered = artworks.filter(a => a.category === active)

  return (
    <main className={styles.main}>
      <div className={styles.header}>
        <div className={styles.sectionLabel}>GALLERY</div>
        <div className={styles.filters}>
          {categories.map(cat => (
            <button
              key={cat}
              className={`${styles.filter} ${active === cat ? styles.filterActive : ''}`}
              onClick={() => setParams({ medium: cat }, { replace: true })}
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
