import { useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { artworks } from '../data/artworks'
import styles from './Work.module.css'

export default function Work() {
  const { id } = useParams()
  const index = artworks.findIndex(a => String(a.id) === id)
  const work = artworks[index]

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [id])

  if (!work) {
    return (
      <main className={styles.main}>
        <p className={styles.missing}>Work not found.</p>
        <Link to="/works" className={styles.back}>← ALL WORKS</Link>
      </main>
    )
  }

  const prev = artworks[index - 1]
  const next = artworks[index + 1]

  return (
    <main className={styles.main}>
      <Link to="/works" className={styles.back}>← ALL WORKS</Link>

      <article className={styles.work}>
        <div className={styles.imageWrap}>
          <img src={work.src} alt={work.title} />
        </div>

        <div className={styles.info}>
          <h1 className={styles.title}>{work.title}</h1>
          <dl className={styles.details}>
            <dt>Medium</dt>
            <dd>{work.medium}</dd>
            {work.dimensions && (
              <>
                <dt>Size</dt>
                <dd>{work.dimensions}</dd>
              </>
            )}
            <dt>Year</dt>
            <dd>{work.year}</dd>
          </dl>
          {work.description && (
            <p className={styles.description}>{work.description}</p>
          )}
        </div>
      </article>

      <nav className={styles.pager}>
        {prev ? <Link to={`/works/${prev.id}`}>← {prev.title}</Link> : <span />}
        {next ? <Link to={`/works/${next.id}`}>{next.title} →</Link> : <span />}
      </nav>

      <footer className={styles.footer}>
        <span>✦ SAM BURWOOD ✦ SHEFFIELD ✦ {new Date().getFullYear()} ✦</span>
      </footer>
    </main>
  )
}
