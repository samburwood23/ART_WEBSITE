import styles from './About.module.css'

export default function About() {
  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <div className={styles.grid}>
          <div className={styles.imageCol}>
            <div className={styles.imgWrap}>
              <img
                src="https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=600&q=80"
                alt="Artist in studio"
              />
            </div>
          </div>
          <div className={styles.textCol}>
            <p className={styles.eyebrow}>About</p>
            <h1 className={styles.title}>Samantha<br />Burwood</h1>
            <div className={styles.bio}>
              <p>
                I am a painter based in Edinburgh, working primarily in oils and watercolour.
                My practice is rooted in careful observation — the quality of morning light on
                a tabletop, the particular stillness of a room in winter, the weight of familiar objects.
              </p>
              <p>
                I studied Fine Art at Edinburgh College of Art, graduating in 2015.
                Since then my work has been shown in group and solo exhibitions across Scotland and London.
              </p>
              <p>
                Each painting begins with extended looking — sketching and working in gouache
                before moving to the final medium. I am interested in the slow accumulation of marks
                and what gets revealed in the process.
              </p>
            </div>
            <div className={styles.details}>
              <div className={styles.detail}>
                <span className={styles.detailLabel}>Based in</span>
                <span>Edinburgh, Scotland</span>
              </div>
              <div className={styles.detail}>
                <span className={styles.detailLabel}>Education</span>
                <span>Edinburgh College of Art, MFA 2015</span>
              </div>
              <div className={styles.detail}>
                <span className={styles.detailLabel}>Exhibitions</span>
                <span>Scottish Gallery, Arusha Gallery, Royal Scottish Academy</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
