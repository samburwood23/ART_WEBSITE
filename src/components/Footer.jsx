import styles from './Footer.module.css'

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <span className={styles.name}>Sam Burwood</span>
        <span>Sheffield · © {new Date().getFullYear()}</span>
      </div>
    </footer>
  )
}
