
import React from 'react'
import { NavLink, Outlet } from 'react-router-dom'

const NavItem = ({ to, label }: { to: string; label: string }) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      `px-3 py-2 rounded-xl text-sm ${isActive ? 'bg-sky-700' : 'hover:bg-neutral-800'}`
    }
  >
    {label}
  </NavLink>
)

export default function AppShell() {
  return (
    <div className="min-h-screen grid grid-rows-[auto,1fr]">
      <header className="sticky top-0 z-10 bg-neutral-950/80 backdrop-blur border-b border-neutral-800">
        <div className="mx-auto max-w-5xl px-4 py-3 flex items-center gap-3">
          <div className="font-semibold">🏋️ Workout Tracker</div>
          <nav className="ml-auto flex gap-1">
            <NavItem to="/" label="Dashboard" />
            <NavItem to="/library" label="Library" />
            <NavItem to="/templates" label="Templates" />
            <NavItem to="/session/new" label="Start" />
            <NavItem to="/analytics" label="Analytics" />
            <NavItem to="/export" label="Export" />
            <NavItem to="/settings" label="Settings" />
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-5xl w-full px-4 py-4">
        <Outlet />
      </main>
    </div>
  )
}
