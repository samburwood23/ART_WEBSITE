import { Link } from 'react-router-dom'
import { artworks } from '../data/artworks'
import styles from './About.module.css'

const PHOTO = 'https://res.cloudinary.com/fcwtlbmz/image/upload/w_800,q_80/v1792923260/unnamed_ailqxd.png'

const favourites = [36, 31, 1, 33, 12, 40].map(id => artworks.find(a => a.id === id))

const spec = [
  ['Based in', 'Sheffield, UK'],
  ['Works in', 'Mixed media, acrylic markers'],
  ['Catalogued', `${artworks.length} works · 2025–2026`],
  ['Usual size', '50 × 60 cm'],
  ['Largest', '100 × 150 cm'],
  ['Commissions', 'Open, get in touch'],
]

const timeline = [
  ['2025', 'Markers No. 1–6', 'A first series in acrylic markers.'],
  ['2026', 'The computing paintings', 'Mixed media on 50 × 60 cm, from Stack Trace and Hotfix through to Triage and Dark Fibre.'],
  ['2026', 'First large works', 'Watchdog and Bus Topology, each 100 × 150 cm.'],
  ['2026', 'The quantum set', 'Superposition, Entanglement, Decoherence and Ground State.'],
]

export default function About() {
  return (
    <main className={styles.main}>
      <div className={styles.sectionLabel}>♥ ABOUT ♥</div>

      <section className={styles.hero}>
        <div className={styles.portrait}>
          <img src={PHOTO} alt="Sam Burwood" />
        </div>
        <div className={styles.bio}>
          <h1 className={styles.title}>SAM<br />BURWOOD</h1>
          <p className={styles.lead}>
            Artist based in Sheffield. Working in oil, acrylic markers, and geometric abstraction.
          </p>
          <p>C in GCSE Art but god loves a trier.</p>
          <p>
            Most of my paintings are named after computing terms, like Stack Trace, Hotfix, Failover
            and Memory Leak. The day job leaks into the studio: circuit linework, rings and hard edges
            laid over scraped, dragged colour.
          </p>

          <div className={styles.spec}>
            <div className={styles.specHead}>♥ SPEC SHEET ♥</div>
            <dl>
              {spec.map(([label, value]) => (
                <div key={label} className={styles.specRow}>
                  <dt>{label}</dt>
                  <dd>{value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>

      <div className={styles.sectionLabel}>♥ TIMELINE ♥</div>
      <ol className={styles.timeline}>
        {timeline.map(([year, title, text]) => (
          <li key={title}>
            <span className={styles.year}>{year}</span>
            <div>
              <strong>{title}</strong>
              <span>{text}</span>
            </div>
          </li>
        ))}
      </ol>

      <div className={styles.sectionLabel}>♥ A FEW FAVOURITES ♥</div>
      <div className={styles.works}>
        {favourites.map(work => (
          <Link key={work.id} to={`/works/${work.id}`} className={styles.tile}>
            <img src={work.thumb} alt={work.title} loading="lazy" />
            <div className={styles.caption}>
              <span className={styles.captionTitle}>{work.title}</span>
              <span className={styles.captionSize}>{work.dimensions}</span>
            </div>
          </Link>
        ))}
      </div>

      <div className={styles.cta}>
        <Link to="/contact" className={styles.ctaBtn}>♥ COMMISSION A PIECE ♥</Link>
      </div>
    </main>
  )
}
