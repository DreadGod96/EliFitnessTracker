
import React from 'react'
import { createBrowserRouter } from 'react-router-dom'
import AppShell from './components/AppShell'
import Dashboard from './pages/Dashboard'
import ExerciseLibrary from './pages/ExerciseLibrary'
import Templates from './pages/Templates'
import StartSession from './pages/StartSession'
import LiveSession from './pages/LiveSession'
import Analytics from './pages/Analytics'
import ExportData from './pages/ExportData'
import Settings from './pages/Settings'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppShell />,
    children: [
      { index: true, element: <Dashboard /> },
      { path: 'library', element: <ExerciseLibrary /> },
      { path: 'templates', element: <Templates /> },
      { path: 'session/new', element: <StartSession /> },
      { path: 'session/:id', element: <LiveSession /> },
      { path: 'analytics', element: <Analytics /> },
      { path: 'export', element: <ExportData /> },
      { path: 'settings', element: <Settings /> },
    ],
  },
])
