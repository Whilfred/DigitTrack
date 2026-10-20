"use client"
import { useEffect, useRef, useState } from 'react'
import { CONFIG } from '../config'

export default function Background() {
  const [showVideo, setShowVideo] = useState(!!CONFIG.video)
  const ref = useRef(null)
  useEffect(() => {
    if (CONFIG.image) document.documentElement.style.setProperty('--thumb', `url("${CONFIG.image}")`)
    ref.current?.play?.().catch(() => {})
  }, [])
  return (
    <div className="bg" aria-hidden="true" style={CONFIG.image ? { backgroundImage: `url("${CONFIG.image}")` } : undefined}>
      {showVideo && (
        <video ref={ref} src={CONFIG.video} poster={CONFIG.image || undefined}
          autoPlay muted loop playsInline preload="auto" onError={() => setShowVideo(false)} />
      )}
    </div>
  )
}
