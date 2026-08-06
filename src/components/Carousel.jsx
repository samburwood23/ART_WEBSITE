import { useState, useEffect } from 'react'
import styles from './Carousel.module.css'

export default function Carousel({ images }) {
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent(c => (c + 1) % images.length)
    }, 3000)
    return () => clearInterval(timer)
  }, [images.length])

  const prev = () => setCurrent(c => (c - 1 + images.length) % images.length)
  const next = () => setCurrent(c => (c + 1) % images.length)

  return (
    <div className={styles.carousel}>
      <button className={`${styles.arrow} ${styles.arrowLeft}`} onClick={prev}>◄</button>

      <div className={styles.frame}>
        {images.map((img, i) => (
          <img
            key={i}
            src={img.src}
            alt=""
            className={`${styles.slide} ${i === current ? styles.slideActive : ''}`}
          />
        ))}
        <div className={styles.counter}>
          {current + 1} / {images.length}
        </div>
      </div>

      <button className={`${styles.arrow} ${styles.arrowRight}`} onClick={next}>►</button>

      <div className={styles.dots}>
        {images.map((_, i) => (
          <button
            key={i}
            className={`${styles.dot} ${i === current ? styles.dotActive : ''}`}
            onClick={() => setCurrent(i)}
          />
        ))}
      </div>
    </div>
  )
}
