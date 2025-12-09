import './App.css'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import WinterSnow from './components/WinterSnow'
import Skills from './components/Skills'
import About from './components/About'
import Project from './components/Project'
import Contact from './components/Contact'
import Footer from './components/Footer'
import ScrollShowcase from './components/scrollanimation/ScrollShowcase'
import BackendShowcase from './components/scrollanimation/BackendShowcase'
import { BrowserRouter } from "react-router-dom";

function App() {
  return (
    <>
     <BrowserRouter>
      {/* <WinterSnow/> */}
      <Navbar />
      <Hero />
       <ScrollShowcase />
       <BackendShowcase/>

      <Skills />
      <About />
      <Project />
      <Contact />
      <Footer />
      </BrowserRouter>
    </>
  )
}

export default App
