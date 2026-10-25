import { Link, useLocation } from 'react-router-dom'
import styles from './Nav.module.css'

export default function Nav() {
  const { pathname } = useLocation()

  return (
    <header className={styles.header}>
      <div className={styles.titleBar}>
        <Link to="/" className={styles.title}>SAM BURWOOD</Link>
        <span className={styles.subtitle}>♥ GEOMETRIC ABSTRACT ART ♥</span>
        <nav className={styles.nav}>
          <Link to="/works" className={`${styles.navLink} ${pathname.startsWith('/works') ? styles.navActive : ''}`}>ALL WORKS</Link>
          <Link to="/about" className={`${styles.navLink} ${pathname === '/about' ? styles.navActive : ''}`}>ABOUT</Link>
          <Link to="/contact" className={`${styles.navLink} ${pathname === '/contact' ? styles.navActive : ''}`}>CONTACT</Link>
        </nav>
      </div>
    </header>
  )
}
