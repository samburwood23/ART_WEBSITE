import styles from './Footer.module.css'

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <p>© {new Date().getFullYear()} Samantha Burwood. All rights reserved.</p>
    </footer>
  )
}
