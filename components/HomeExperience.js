"use client"

import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '../lib/auth'

const steps = [
  { number: '01', title: 'Clarifiez votre idée', text: 'Un parcours guidé pour passer d’une intuition à une offre digitale qui a du sens.', tone: 'blue' },
  { number: '02', title: 'Apprenez en faisant', text: 'Des formations courtes, des exercices concrets et des modèles prêts à adapter.', tone: 'violet' },
  { number: '03', title: 'Lancez sans attendre', text: 'Mettez votre produit en ligne, suivez vos progrès et commencez à vendre.', tone: 'mint' },
]

const courses = [
  { tag: 'Démarrage', title: 'Trouver son idée rentable', meta: '4 modules · 38 min', color: 'sunset' },
  { tag: 'Création', title: 'Construire son premier ebook', meta: '6 modules · 1 h 12', color: 'ocean' },
  { tag: 'Vente', title: 'Lancer sa page et convertir', meta: '5 modules · 52 min', color: 'violet' },
]

function Arrow() {
  return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
}

function Reveal({ children, className = '' }) {
  const ref = useRef(null)
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const node = ref.current
    if (!node) return
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setVisible(true)
        observer.disconnect()
      }
    }, { threshold: 0.14 })
    observer.observe(node)
    return () => observer.disconnect()
  }, [])
  return <div ref={ref} className={`reveal ${visible ? 'is-visible' : ''} ${className}`}>{children}</div>
}

function Counter({ value, suffix = '' }) {
  const ref = useRef(null)
  const [count, setCount] = useState(0)
  useEffect(() => {
    const node = ref.current
    if (!node) return
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return
      let start = 0
      const duration = 1100
      const started = performance.now()
      const tick = (time) => {
        const progress = Math.min((time - started) / duration, 1)
        const eased = 1 - Math.pow(1 - progress, 3)
        setCount(Math.round(eased * value))
        if (progress < 1) requestAnimationFrame(tick)
      }
      requestAnimationFrame(tick)
      observer.disconnect()
    }, { threshold: 0.8 })
    observer.observe(node)
    return () => observer.disconnect()
  }, [value])
  return <span ref={ref}>{count}{suffix}</span>
}

export default function HomeExperience() {
  const router = useRouter()
  const { user } = useAuth()
  const [goal, setGoal] = useState('')
  const [activeCourse, setActiveCourse] = useState(1)
  const heroRef = useRef(null)

  useEffect(() => {
    const node = heroRef.current
    if (!node) return
    const move = (event) => {
      const x = (event.clientX / window.innerWidth - 0.5) * 2
      const y = (event.clientY / window.innerHeight - 0.5) * 2
      node.style.setProperty('--mx', `${x * 12}px`)
      node.style.setProperty('--my', `${y * 8}px`)
    }
    window.addEventListener('pointermove', move, { passive: true })
    return () => window.removeEventListener('pointermove', move)
  }, [])

  const submit = (event) => {
    event.preventDefault()
    if (goal.trim()) sessionStorage.setItem('ws_goal', goal.trim())
    router.push(user ? '/dashboard' : '/inscription')
  }

  return (
    <div className="home-experience">
      <section className="motion-hero" ref={heroRef}>
        <div className="hero-orbit orbit-one" />
        <div className="hero-orbit orbit-two" />
        <div className="hero-grid" />
        <div className="hero-copy">
          <div className="eyebrow"><span className="eyebrow-dot" /> L’école digitale qui vous met en mouvement</div>
          <h1>Votre idée mérite<br /><em>un vrai départ.</em></h1>
          <p className="hero-text">Apprenez à créer, lancer et vendre vos produits digitaux avec un parcours clair, pratique et pensé pour avancer vraiment.</p>
          <form className="motion-search" onSubmit={submit}>
            <span className="search-spark">✦</span>
            <input value={goal} onChange={(event) => setGoal(event.target.value)} placeholder="Quel est votre prochain objectif ?" aria-label="Votre prochain objectif" />
            <button type="submit">Commencer <Arrow /></button>
          </form>
          <div className="hero-proof"><span className="avatar-stack"><i>AM</i><i>FK</i><i>SD</i></span><span><strong>+2 500</strong> créateurs accompagnés</span><span className="proof-star">★★★★★</span></div>
        </div>
        <div className="hero-visual" aria-hidden="true">
          <div className="visual-glow" />
          <div className="floating-note note-top"><span>PROGRESSION</span><strong>+38%</strong><small>ce mois-ci ↗</small></div>
          <div className="dashboard-card">
            <div className="dash-top"><span className="mini-logo">W</span><span>Mon parcours</span><b>•••</b></div>
            <div className="dash-score"><div><small>Objectif du mois</small><strong>Créer mon ebook</strong></div><div className="score-ring"><b>68</b><span>%</span></div></div>
            <div className="dash-chart"><span style={{ height: '32%' }} /><span style={{ height: '48%' }} /><span style={{ height: '42%' }} /><span style={{ height: '66%' }} /><span style={{ height: '58%' }} /><span style={{ height: '84%' }} /><span style={{ height: '74%' }} /></div>
            <div className="dash-days"><small>Lun</small><small>Mar</small><small>Mer</small><small>Jeu</small><small>Ven</small><small>Sam</small><small>Dim</small></div>
            <div className="dash-task"><span className="task-check">✓</span><span><b>Page de vente</b><small>Étape terminée</small></span><span className="task-arrow">↗</span></div>
          </div>
          <div className="floating-note note-bottom"><span>PROCHAINE ÉTAPE</span><strong>Publier mon offre</strong><small><i /> recommandée aujourd’hui</small></div>
        </div>
        <a href="#methode" className="scroll-cue"><span>Découvrir la méthode</span><b>↓</b></a>
      </section>

      <div className="ticker" aria-label="Thématiques proposées"><div className="ticker-track"><span>CRÉATION DE PRODUITS</span><b>✦</b><span>VENTE EN LIGNE</span><b>✦</b><span>PERSONAL BRANDING</span><b>✦</b><span>AUTOMATISATION</span><b>✦</b><span>CRÉATION DE PRODUITS</span><b>✦</b><span>VENTE EN LIGNE</span><b>✦</b><span>PERSONAL BRANDING</span><b>✦</b></div></div>

      <section className="story-section" id="methode">
        <Reveal className="section-intro"><span className="kicker">LA MÉTHODE WINNER</span><h2>Moins de théorie.<br /><span>Plus de mouvement.</span></h2><p>Chaque écran a une mission : vous aider à passer à l’étape suivante, sans vous perdre dans le bruit.</p></Reveal>
        <div className="step-stack">{steps.map((step, index) => <Reveal key={step.number} className="step-reveal"><article className={`motion-step ${step.tone}`}><div className="step-number">{step.number}</div><div className="step-content"><span className="step-label">ÉTAPE {index + 1}</span><h3>{step.title}</h3><p>{step.text}</p><Link href="/parcours">Voir le parcours <Arrow /></Link></div><div className="step-symbol">{index === 0 ? '✦' : index === 1 ? '↗' : '◒'}</div></article></Reveal>)}</div>
      </section>

      <section className="stats-section"><Reveal className="stats-heading"><span className="kicker">L’ÉLAN EST COLLECTIF</span><h2>Des chiffres qui<br /><span>donnent envie d’y aller.</span></h2></Reveal><div className="stats-grid"><Reveal className="stat-card"><strong><Counter value={2500} suffix="+" /></strong><span>créateurs dans la communauté</span></Reveal><Reveal className="stat-card featured"><strong><Counter value={94} suffix="%" /></strong><span>terminent leur premier parcours</span></Reveal><Reveal className="stat-card"><strong><Counter value={16} suffix="" /></strong><span>formations pour passer à l’action</span></Reveal></div></section>

      <section className="courses-section" id="formations"><Reveal className="section-intro compact"><span className="kicker">APPRENDRE À SON RYTHME</span><h2>Un parcours pour<br /><span>chaque ambition.</span></h2><p>Choisissez votre point de départ. On s’occupe de la suite.</p></Reveal><div className="course-showcase"><div className="course-tabs">{courses.map((course, index) => <button key={course.title} className={activeCourse === index ? 'active' : ''} onClick={() => setActiveCourse(index)}><span>0{index + 1}</span>{course.tag}</button>)}</div><div className={`course-feature ${courses[activeCourse].color}`}><div className="course-art"><span className="art-circle" /><span className="art-line line-a" /><span className="art-line line-b" /><b>W</b></div><div className="course-details"><span className="course-tag">{courses[activeCourse].tag}</span><h3>{courses[activeCourse].title}</h3><p>Un atelier guidé pour construire quelque chose de concret, même si vous partez de zéro.</p><small>{courses[activeCourse].meta}</small><Link className="text-link" href="/formations">Explorer les formations <Arrow /></Link></div></div></div></section>

      <section className="final-cta"><div className="cta-stars">✦　✦　✦</div><h2>Le bon moment<br /><em>c’est maintenant.</em></h2><p>Votre prochaine étape est plus proche que vous ne le pensez.</p><Link href={user ? '/dashboard' : '/inscription'} className="big-cta">Commencer mon parcours <Arrow /></Link></section>
    </div>
  )
}
