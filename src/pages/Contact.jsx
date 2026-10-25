import styles from './Contact.module.css'

export default function Contact() {
  return (
    <main className={styles.main}>
      <div className={styles.box}>
        <div className={styles.sectionLabel}>♥ CONTACT ♥</div>
        <p className={styles.body}>
          For enquiries, commissions, or just to say hello —
        </p>
        <a href="mailto:samanthaburwood@gmail.com" className={styles.email}>
          samanthaburwood@gmail.com
        </a>
      </div>
    </main>
  )
}
