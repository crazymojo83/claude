import { Routes, Route } from 'react-router-dom'
import './styles.css'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import About from './components/About'
import Projects from './components/Projects'
import Skills from './components/Skills'
import Blog from './components/Blog'
import Journey from './components/Journey'
import Contact from './components/Contact'
import BlogPost from './components/BlogPost'
import SocialPostGenerator from './components/SocialPostGenerator'

function HomePage() {
  return (
    <>
      <Navbar />
      <Hero />
      <div className="divider" />
      <Blog />
      <div className="divider" />
      <Projects />
      <div className="divider" />
      <About />
      <div className="divider" />
      <Journey />
      <div className="divider" />
      <Skills />
      <div className="divider" />
      <Contact />
    </>
  )
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/post/:id" element={<BlogPost />} />
      <Route path="/social" element={<SocialPostGenerator />} />
    </Routes>
  )
}

export default App
