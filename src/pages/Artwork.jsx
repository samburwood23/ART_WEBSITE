import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { artworks } from '../data/artworks'
import styles from './Artwork.module.css'

const EMAIL = 'samanthaburwood@gmail.com'

const STATUS = {
  available: { label: 'AVAILABLE', className: 'statusAvailable', cta: '✦ ENQUIRE ABOUT THIS PIECE ✦' },
  sold: { label: 'SOLD', className: 'statusSold', cta: '✦ ASK ABOUT A SIMILAR PIECE ✦' },
  'on request': { label: 'PRICE ON REQUEST', className: 'statusRequest', cta: '✦ ENQUIRE ABOUT THIS PIECE ✦' },
}

function enquiryLink(work) {
  const subject = `Enquiry: ${work.title}`
  const body = work.status === 'sold'
    ? `Hi Sam,\n\n${work.title} has sold — would you make something similar?\n\n`
    : `Hi Sam,\n\nI'm interested in ${work.title}.\n\n`
  return `mailto:${EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
}

export default function Artwork() {
  const { id } = useParams()
  const index = artworks.findIndex(a => String(a.id) === id)
  const work = artworks[index]
  const [fullscreen, setFullscreen] = useState(false)

  useEffect(() => {
    window.scrollTo(0, 0)
    setFullscreen(false)
  }, [id])

  useEffect(() => {
    if (!fullscreen) return
    const onKey = e => { if (e.key === 'Escape') setFullscreen(false) }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [fullscreen])

  if (!work) {
    return (
      <main className={styles.main}>
        <p className={styles.notFound}>That painting couldn't be found.</p>
        <Link to="/works" className={styles.navLink}>← ALL WORKS</Link>
      </main>
    )
  }

  const prev = artworks[(index - 1 + artworks.length) % artworks.length]
  const next = artworks[(index + 1) % artworks.length]
  const more = [1, 2, 3, 4].map(n => artworks[(index + n) % artworks.length])
  const status = STATUS[work.status]

  const details = [
    ['Year', work.year],
    ['Medium', work.medium],
    ['Size', work.dimensions],
    ['Framed', work.framed],
  ].filter(([, value]) => value)

  return (
    <main className={styles.main}>
      <div className={styles.topBar}>
        <Link to="/works" className={styles.navLink}>← ALL WORKS</Link>
        <div className={styles.pager}>
          <Link to={`/works/${prev.id}`} className={styles.navLink}>‹ PREV</Link>
          <span className={styles.count}>{index + 1} / {artworks.length}</span>
          <Link to={`/works/${next.id}`} className={styles.navLink}>NEXT ›</Link>
        </div>
      </div>

      <div className={styles.layout}>
        <div className={styles.imageCol}>
          <button className={styles.imageButton} onClick={() => setFullscreen(true)}>
            <img src={work.src} alt={work.title} />
          </button>
          <p className={styles.hint}>Click image to view full screen</p>
        </div>

        <div className={styles.infoCol}>
          <div className={styles.heading}>
            <span className={styles.category}>✦ {work.category.toUpperCase()} ✦</span>
            <h1 className={styles.title}>{work.title}</h1>
          </div>

          {status && (
            <div className={`${styles.status} ${styles[status.className]}`}>
              <span className={styles.statusDot} />
              <span>{status.label}</span>
            </div>
          )}

          {details.length > 0 && (
            <dl className={styles.details}>
              {details.map(([label, value]) => (
                <div key={label} className={styles.detailRow}>
                  <dt>{label}</dt>
                  <dd>{value}</dd>
                </div>
              ))}
            </dl>
          )}

          {work.description && <p className={styles.description}>{work.description}</p>}

          {work.price && work.status === 'available' && (
            <div className={styles.price}>{work.price}</div>
          )}

          <div className={styles.enquire}>
            <a href={enquiryLink(work)} className={styles.enquireBtn}>
              {status ? status.cta : STATUS.available.cta}
            </a>
            <p className={styles.hint}>Opens your email with this painting's name already filled in.</p>
          </div>
        </div>
      </div>

      <section className={styles.more}>
        <div className={styles.sectionLabel}>✦ MORE WORKS ✦</div>
        <div className={styles.moreGrid}>
          {more.map(w => (
            <Link key={w.id} to={`/works/${w.id}`} className={styles.moreCell}>
              <img src={w.thumb} alt={w.title} loading="lazy" />
            </Link>
          ))}
        </div>
      </section>

      {fullscreen && (
        <div className={styles.lightbox} onClick={() => setFullscreen(false)}>
          <button className={styles.close} onClick={() => setFullscreen(false)}>✕ CLOSE</button>
          <img src={work.src} alt={work.title} onClick={e => e.stopPropagation()} />
        </div>
      )}
    </main>
  )
}
