'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const navItems = [
  { href: '/', label: 'Dashboard', icon: '◈' },
  { href: '/signals', label: 'Signal Tracker', icon: '◎' },
  { href: '/content', label: 'Content Manager', icon: '◻' },
  { href: '/communications', label: 'Communications', icon: '◈' },
  { href: '/reports', label: 'Reports', icon: '▦' },
  { href: '/settings', label: 'Settings', icon: '◇' },
]

export function Navigation() {
  const pathname = usePathname()

  return (
    <nav className="w-56 bg-slate-900 text-slate-100 flex flex-col py-6 px-4 gap-1 shrink-0">
      <div className="mb-8 px-2">
        <h1 className="text-sm font-semibold text-slate-300 uppercase tracking-widest">Personal Brand</h1>
        <p className="text-xs text-slate-500 mt-1">Developer</p>
      </div>
      {navItems.map((item) => {
        const active = pathname === item.href
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
              active
                ? 'bg-brand-600 text-white'
                : 'text-slate-400 hover:bg-slate-800 hover:text-slate-100'
            }`}
          >
            <span className="text-base">{item.icon}</span>
            {item.label}
          </Link>
        )
      })}
    </nav>
  )
}
