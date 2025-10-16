import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import WinterSnow from './components/WinterSnow'
import Skills from './components/Skills'
import About from './components/About'
import Project from './components/Project'
import Contact from './components/Contact'
import Footer from './components/Footer'

function App() {

  return (
    <>
    <WinterSnow/>
    <Navbar/>
    <Hero/>
    <Skills/>
    <About/>
    <Project/>
    <Contact/>
    <Footer/>
    </>
  )
}

export default App
