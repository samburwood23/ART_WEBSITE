import { Link } from 'react-router-dom'
import { artworks } from '../data/artworks'
import styles from './Home.module.css'

const writingPreviews = [
  {
    tab: 'everyone',
    label: 'For Everyone',
    title: "I'm a painter who uses AI. Let me explain before you close this tab.",
    excerpt: "The arguments against AI art are real and I'm not going to pretend they aren't. Training large image models consumes enormous amounts of energy…",
  },
  {
    tab: 'technical',
    label: 'Technical',
    title: 'Using Replicate to Workshop Painting Ideas with AI Image Generation',
    excerpt: "Replicate is a cloud API that lets you run open-source machine learning models with a single HTTP call and no GPU required…",
  },
]

export default function Home() {
  const featured = artworks.slice(0, 3)

  return (
    <main>
      <section className={styles.hero}>
        <div className={styles.heroInner}>
          <p className={styles.heroEyebrow}>Artist — Sheffield</p>
          <h1 className={styles.heroTitle}>Sam<br />Burwood</h1>
          <p className={styles.heroSub}>
            Geometric abstract art. Inspired by life.
          </p>
          <Link to="/gallery" className={styles.heroCta}>View Gallery</Link>
        </div>
      </section>

      <section className={styles.featured}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionTitle}>Selected Works</span>
            <Link to="/gallery" className={styles.textLink}>See all →</Link>
          </div>
          <div className={styles.grid}>
            {featured.map(work => (
              <Link to="/gallery" key={work.id} className={styles.card}>
                <div className={styles.imgWrap}>
                  <img src={work.thumb} alt="" loading="lazy" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.writing}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionTitle}>Writing</span>
            <Link to="/writing" className={styles.textLink}>All posts →</Link>
          </div>
          <div className={styles.writingGrid}>
            {writingPreviews.map((post, i) => (
              <Link to="/writing" key={i} className={styles.writingCard}>
                <span className={styles.writingLabel}>{post.label}</span>
                <h3 className={styles.writingTitle}>{post.title}</h3>
                <p className={styles.writingExcerpt}>{post.excerpt}</p>
                <span className={styles.readMore}>Read →</span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}
