import { Routes, Route } from 'react-router-dom'
import Nav from './components/Nav'
import Footer from './components/Footer'
import Home from './pages/Home'
import Gallery from './pages/Gallery'
import About from './pages/About'
import Process from './pages/Process'

export default function App() {
  return (
    <>
      <Nav />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/gallery" element={<Gallery />} />
        <Route path="/process" element={<Process />} />
        <Route path="/about" element={<About />} />
      </Routes>
      <Footer />
    </>
  )
}
