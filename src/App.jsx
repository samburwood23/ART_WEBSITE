import { Routes, Route } from 'react-router-dom'
import Nav from './components/Nav'
import Home from './pages/Home'
import AllWorks from './pages/AllWorks'
import Work from './pages/Work'
import Contact from './pages/Contact'

export default function App() {
  return (
    <>
      <Nav />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/works" element={<AllWorks />} />
        <Route path="/works/:id" element={<Work />} />
        <Route path="/contact" element={<Contact />} />
      </Routes>
    </>
  )
}
