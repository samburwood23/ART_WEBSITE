import { useState } from 'react'
import styles from './Contact.module.css'

export default function Contact() {
  const [sent, setSent] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', message: '' })

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  const handleSubmit = e => {
    e.preventDefault()
    setSent(true)
  }

  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <div className={styles.grid}>
          <div className={styles.intro}>
            <p className={styles.eyebrow}>Get in touch</p>
            <h1 className={styles.title}>Contact</h1>
            <p className={styles.sub}>
              For enquiries about available works, commissions, or exhibitions,
              please fill in the form or reach out directly.
            </p>
            <div className={styles.contactLinks}>
              <div>
                <span className={styles.label}>Email</span>
                <a href="mailto:hello@samanthaburwood.com">hello@samanthaburwood.com</a>
              </div>
              <div>
                <span className={styles.label}>Instagram</span>
                <a href="https://instagram.com" target="_blank" rel="noreferrer">@samanthaburwood</a>
              </div>
            </div>
          </div>

          <div className={styles.formCol}>
            {sent ? (
              <div className={styles.thanks}>
                <p>Thank you for your message.</p>
                <p>I'll be in touch soon.</p>
              </div>
            ) : (
              <form className={styles.form} onSubmit={handleSubmit}>
                <div className={styles.field}>
                  <label htmlFor="name">Name</label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    value={form.name}
                    onChange={handleChange}
                  />
                </div>
                <div className={styles.field}>
                  <label htmlFor="email">Email</label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={form.email}
                    onChange={handleChange}
                  />
                </div>
                <div className={styles.field}>
                  <label htmlFor="message">Message</label>
                  <textarea
                    id="message"
                    name="message"
                    rows={6}
                    required
                    value={form.message}
                    onChange={handleChange}
                  />
                </div>
                <button type="submit" className={styles.submit}>Send message</button>
              </form>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}
