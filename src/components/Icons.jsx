// A small, consistent icon set for the site. Kept as plain inline SVG
// (no icon-font dependency) so the stroke weight and corner language
// stay identical to the contour-ring signature mark used elsewhere.

export function ContourMark({ className = 'w-9 h-9' }) {
  return (
    <svg viewBox="0 0 40 40" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="20" cy="24" r="14" stroke="#1F4D3A" strokeWidth="2" />
      <circle cx="20" cy="24" r="9.5" stroke="#3F8F5F" strokeWidth="2" />
      <circle cx="20" cy="24" r="5" fill="#3F8F5F" />
      <path d="M20 6 L20 13" stroke="#B4622E" strokeWidth="2" strokeLinecap="round" />
      <path d="M20 6 C17 8 16 10.5 17.5 13" stroke="#B4622E" strokeWidth="2" strokeLinecap="round" fill="none" />
      <path d="M20 6 C23 8 24 10.5 22.5 13" stroke="#B4622E" strokeWidth="2" strokeLinecap="round" fill="none" />
    </svg>
  )
}

export function IconBench({ className = 'w-5 h-5' }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 20h18" />
      <path d="M5 20V16h14v4" />
      <path d="M7 16v-3.2h10V16" />
      <path d="M9 12.8V10h6v2.8" />
      <path d="M11 10V7.5h2V10" />
    </svg>
  )
}

export function IconSprout({ className = 'w-5 h-5' }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 21V11" />
      <path d="M12 12c0-4 3-6.5 7-6.5C19 9.5 16.5 12.5 12 12z" />
      <path d="M12 15c0-3-2.5-5-6-5 0 3.2 2 5.6 6 5z" />
    </svg>
  )
}

export function IconClock({ className = 'w-5 h-5' }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 7.5V12l3 2" />
    </svg>
  )
}

export function IconArea({ className = 'w-5 h-5' }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round">
      <path d="M3 17 8 6l5 4 4-3 4 10" />
      <path d="M3 20h18" />
    </svg>
  )
}

export function IconTree({ className = 'w-5 h-5' }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 21v-6" />
      <path d="M12 15 6 9.5 12 3l6 6.5z" />
      <path d="M9.5 12 6 15.5 12 21l6-5.5-3.5-3.5" />
    </svg>
  )
}

export function IconGauge({ className = 'w-5 h-5' }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 15a8 8 0 1 1 16 0" />
      <path d="M12 15l4-5" />
      <path d="M12 15h.01" />
    </svg>
  )
}

export function IconSun({ className = 'w-5 h-5' }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
      <circle cx="12" cy="12" r="4" />
      <path d="M12 3v2M12 19v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M3 12h2M19 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4" />
    </svg>
  )
}

export function IconRain({ className = 'w-5 h-5' }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
      <path d="M6.5 15a4.2 4.2 0 0 1 .6-8.4A5.5 5.5 0 0 1 17.7 8.2 3.8 3.8 0 0 1 17 15.7H7Z" />
      <path d="M8 18l-1 2M12 18l-1 2M16 18l-1 2" />
    </svg>
  )
}

export function IconDoc({ className = 'w-5 h-5' }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round">
      <path d="M7 3h7l4 4v14H7z" />
      <path d="M14 3v4h4" />
      <path d="M9.5 13h5M9.5 16.5h5" />
    </svg>
  )
}

export function IconPin({ className = 'w-5 h-5' }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round">
      <path d="M12 21s-6.5-6.1-6.5-11A6.5 6.5 0 0 1 18.5 10c0 4.9-6.5 11-6.5 11z" />
      <circle cx="12" cy="10" r="2.3" />
    </svg>
  )
}

export function IconPhone({ className = 'w-5 h-5' }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round">
      <path d="M6 3h3l1.6 4.2-2 1.6a13 13 0 0 0 6.6 6.6l1.6-2L21 15v3a2 2 0 0 1-2.2 2C11.8 19.6 4.4 12.2 4 5.2A2 2 0 0 1 6 3z" />
    </svg>
  )
}

export function IconMail({ className = 'w-5 h-5' }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round">
      <rect x="3.5" y="5.5" width="17" height="13" rx="1.5" />
      <path d="M4 6.5l8 6.5 8-6.5" />
    </svg>
  )
}

export function IconArrow({ className = 'w-4 h-4' }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  )
}

export function IconBloom({ className = 'w-5 h-5', color = '#C1723C' }) {
  return (
    <svg viewBox="0 0 24 24" className={className}>
      <g fill={color}>
        <circle cx="12" cy="7" r="3.4" />
        <circle cx="17" cy="12" r="3.4" />
        <circle cx="12" cy="17" r="3.4" />
        <circle cx="7" cy="12" r="3.4" />
        <circle cx="12" cy="12" r="2.6" fill="#5B4636" />
      </g>
    </svg>
  )
}

export function IconLock({ className = 'w-5 h-5' }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="4.5" y="10.5" width="15" height="9.5" rx="2.2" />
      <path d="M8 10.5V7.8a4 4 0 0 1 8 0v2.7" />
      <path d="M12 14.2v2.1" />
    </svg>
  )
}

export function IconUser({ className = 'w-5 h-5' }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="8.5" r="3.8" />
      <path d="M4.8 20c.9-3.5 3.7-5.5 7.2-5.5s6.3 2 7.2 5.5" />
    </svg>
  )
}

export function IconEye({ className = 'w-5 h-5' }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2.5 12S6 6 12 6s9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6z" />
      <circle cx="12" cy="12" r="2.8" />
    </svg>
  )
}

export function IconEyeOff({ className = 'w-5 h-5' }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9.6 6.4A9.6 9.6 0 0 1 12 6c6 0 9.5 6 9.5 6a17 17 0 0 1-2.4 3.1" />
      <path d="M6.2 8A16.7 16.7 0 0 0 2.5 12S6 18 12 18a9.4 9.4 0 0 0 3.4-.6" />
      <path d="M10.1 10.1a2.8 2.8 0 0 0 3.8 3.8" />
      <path d="M4 4l16 16" />
    </svg>
  )
}

export function IconLogout({ className = 'w-5 h-5' }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 4.5H7.5A2.5 2.5 0 0 0 5 7v10a2.5 2.5 0 0 0 2.5 2.5H14" />
      <path d="M16 8.5l3.5 3.5L16 15.5" />
      <path d="M19.5 12H10" />
    </svg>
  )
}

export function IconSpinner({ className = 'w-5 h-5' }) {
  return (
    <svg viewBox="0 0 24 24" className={`${className} animate-spin`} fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
      <circle cx="12" cy="12" r="8.5" className="opacity-25" />
      <path d="M20.5 12A8.5 8.5 0 0 0 12 3.5" />
    </svg>
  )
}

export function IconAlert({ className = 'w-5 h-5' }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 4.5 21 19.5H3L12 4.5z" />
      <path d="M12 10v4" />
      <path d="M12 16.6h.01" />
    </svg>
  )
}

export function IconSettings({ className = 'w-5 h-5' }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 7h10" />
      <path d="M18 7h2" />
      <circle cx="16" cy="7" r="2.1" />
      <path d="M4 17h6" />
      <path d="M14 17h6" />
      <circle cx="12" cy="17" r="2.1" />
    </svg>
  )
}
