import styles from './Footer.module.css'

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <span>✦ SAM BURWOOD ✦ SHEFFIELD ✦ © {new Date().getFullYear()} ✦</span>
    </footer>
  )
}
