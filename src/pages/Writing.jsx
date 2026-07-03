import { useState } from 'react'
import styles from './Writing.module.css'

const forEveryone = [
  {
    id: 1,
    title: "I'm a painter who uses AI. Let me explain before you close this tab.",
    images: [
      'https://res.cloudinary.com/fcwtlbmz/image/upload/v1783096345/out-0_s9qvxc.webp',
      'https://res.cloudinary.com/fcwtlbmz/image/upload/v1783096631/out-0_fv7zad.webp',
      'https://res.cloudinary.com/fcwtlbmz/image/upload/v1783096725/out-0_dfwp1z.webp',
    ],
    content: [
      { type: 'p', text: 'I know. Stay with me.' },
      { type: 'p', text: "The arguments against AI art are real and I'm not going to pretend they aren't. Training large image models consumes enormous amounts of energy. The carbon cost is not nothing, and it's not fully understood yet. There are also legitimate questions about whether those models were trained on artists' work without consent — and if you feel strongly about that, I think that's a reasonable position to hold." },
      { type: 'p', text: "Then there's the other argument: that AI can't make real art because it has no soul. No lived experience. No grief, no obsession. It statistically predicts what pixels should follow other pixels. It has never felt anything about anything." },
      { type: 'p', text: 'I actually agree with this one.' },
      { type: 'p', text: 'Which is why I use it.' },
      { type: 'divider' },
      { type: 'p', text: "I'm a painter. Oils, abstract work, a style I've developed over time." },
      { type: 'p', text: "And I get blocked." },
      { type: 'p', text: "Not creatively blocked in the romantic sense — I don't sit staring at a canvas waiting for inspiration. I mean specifically blocked on decisions. Colour combinations. Whether a composition that works in my head will actually work at scale. Whether a palette I've never tried is worth buying three tubes of paint to test. Whether the thing I'm imagining is interesting or whether I'm just attached to it because I thought of it." },
      { type: 'p', text: "These are real problems and they have a real cost. Paint is expensive. Canvas is expensive. Time spent mixing a colour you end up hating and painting over is time you don't get back." },
      { type: 'divider' },
      { type: 'p', text: "So I started using AI image generation as a workshop tool. Not to make art. To ask questions cheaply." },
      { type: 'p', text: "I can describe a compositional idea in words — dark gold ground, a large enso circle, a band of heavy green across the bottom — and generate twenty variations of that idea in about ninety seconds. I can test five different colour palettes against the same structure. I can see whether something I've been thinking about for weeks is actually worth the canvas it would take to find out." },
      { type: 'images' },
      { type: 'p', text: "The images it produces are not my paintings. They're not even close. They're useful in the same way a rough thumbnail sketch is useful — not as an end point but as a thinking tool." },
      { type: 'p', text: "The AI has no opinion about whether the gold or the magenta is better. It doesn't get attached to an idea. It doesn't have good days and bad days. It just generates, and I look, and I decide. The human judgment is still entirely mine. That's the part that matters." },
      { type: 'divider' },
      { type: 'p', text: "On the environmental point: I hold that concern and I use the tool anyway. I think that's an honest position rather than a hypocritical one. I also eat meat occasionally and take flights. Most of us are navigating real tradeoffs imperfectly. I try to be conscious about when I'm reaching for AI generation and whether it's actually useful, rather than generating hundreds of images I'll never look at. That's not absolution. It's just the reality of trying to use a tool thoughtfully in a world where no tool is clean." },
      { type: 'divider' },
      { type: 'p', text: "AI can't want things. It can't be unsettled by something and need to work out what that means on a canvas. The images it generates are a prompt, not an answer." },
      { type: 'p', text: "But it can help me spend less time stuck on whether magenta or violet is the right ground, and more time actually painting." },
      { type: 'p', text: "That trade works for me." },
    ],
  },
]

const technical = []

export default function Writing() {
  const [tab, setTab] = useState('everyone')

  const posts = tab === 'everyone' ? forEveryone : technical

  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <h1 className={styles.title}>Writing</h1>
        <div className={styles.tabs}>
          <button
            className={`${styles.tab} ${tab === 'everyone' ? styles.tabActive : ''}`}
            onClick={() => setTab('everyone')}
          >
            For Everyone
          </button>
          <button
            className={`${styles.tab} ${tab === 'technical' ? styles.tabActive : ''}`}
            onClick={() => setTab('technical')}
          >
            Technical
          </button>
        </div>

        {posts.length === 0 ? (
          <p className={styles.empty}>Coming soon.</p>
        ) : (
          posts.map(post => (
            <article key={post.id} className={styles.post}>
              <h2 className={styles.postTitle}>{post.title}</h2>
              <div className={styles.body}>
                {post.content.map((block, i) => {
                  if (block.type === 'p') return <p key={i}>{block.text}</p>
                  if (block.type === 'divider') return <hr key={i} className={styles.divider} />
                  if (block.type === 'images') return (
                    <div key={i} className={styles.imageRow}>
                      {post.images.map((src, j) => (
                        <img key={j} src={src} alt="" loading="lazy" />
                      ))}
                    </div>
                  )
                  return null
                })}
              </div>
            </article>
          ))
        )}
      </div>
    </main>
  )
}
