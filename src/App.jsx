import { lazy, Suspense } from 'react'
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
import Tools from './components/Tools'
import ToolDetail from './components/ToolDetail'
import ClaudePlugins from './components/ClaudePlugins'

const ZendeskDashboard = lazy(() => import('./components/zendesk/ZendeskDashboard'))

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
      <ClaudePlugins />
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
      <Route path="/tools" element={<Tools />} />
      <Route path="/tools/:slug" element={<ToolDetail />} />
      <Route path="/social" element={<SocialPostGenerator />} />
      <Route path="/zendesk" element={<Suspense fallback={<div className="zd-loading"><p>Loading dashboard...</p></div>}><ZendeskDashboard /></Suspense>} />
    </Routes>
  )
}

export default App
