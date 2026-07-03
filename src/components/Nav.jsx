import { NavLink } from 'react-router-dom'
import styles from './Nav.module.css'

export default function Nav() {
  return (
    <header className={styles.header}>
      <nav className={styles.nav}>
        <NavLink to="/" className={styles.logo}>
          Sam Burwood
        </NavLink>
        <ul className={styles.links}>
          <li><NavLink to="/" end className={({ isActive }) => isActive ? styles.active : ''}>Home</NavLink></li>
          <li><NavLink to="/gallery" className={({ isActive }) => isActive ? styles.active : ''}>Gallery</NavLink></li>
          <li><NavLink to="/writing" className={({ isActive }) => isActive ? styles.active : ''}>Writing</NavLink></li>
          <li><NavLink to="/about" className={({ isActive }) => isActive ? styles.active : ''}>About</NavLink></li>
        </ul>
      </nav>
    </header>
  )
}
