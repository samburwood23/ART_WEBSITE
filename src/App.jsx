import { Routes, Route } from 'react-router-dom'
import Nav from './components/Nav'
import Home from './pages/Home'
import AllWorks from './pages/AllWorks'

export default function App() {
  return (
    <>
      <Nav />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/works" element={<AllWorks />} />
      </Routes>
    </>
  )
}
