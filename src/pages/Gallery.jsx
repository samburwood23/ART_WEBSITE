import { useState } from 'react'
import { artworks, categories } from '../data/artworks'
import styles from './Gallery.module.css'

export default function Gallery() {
  const [activeCategory, setActiveCategory] = useState('Painting')
  const [lightbox, setLightbox] = useState(null)

  const filtered = artworks.filter(a => a.category === activeCategory)

  const openLightbox = (work) => setLightbox(work)
  const closeLightbox = () => setLightbox(null)

  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <header className={styles.header}>
          <h1 className={styles.title}>Gallery</h1>
          <div className={styles.filters}>
            {categories.map(cat => (
              <button
                key={cat}
                className={`${styles.filter} ${activeCategory === cat ? styles.filterActive : ''}`}
                onClick={() => setActiveCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
        </header>

        <div className={styles.grid}>
          {filtered.map(work => (
            <button key={work.id} className={styles.item} onClick={() => openLightbox(work)}>
              <div className={styles.imgWrap}>
                <img src={work.thumb} alt={work.title} loading="lazy" />
              </div>
              <div className={styles.itemInfo}>
                <span className={styles.itemTitle}>{work.title}</span>
                <span className={styles.itemMeta}>{work.medium}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {lightbox && (
        <div className={styles.lightbox} onClick={closeLightbox}>
          <button className={styles.close} onClick={closeLightbox}>✕</button>
          <div className={styles.lightboxContent} onClick={e => e.stopPropagation()}>
            <img src={lightbox.src} alt={lightbox.title} />
            <div className={styles.lightboxInfo}>
              <h2>{lightbox.title}</h2>
              <p>{lightbox.medium}</p>
              <p>{lightbox.dimensions}</p>
              <p>{lightbox.year}</p>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}
