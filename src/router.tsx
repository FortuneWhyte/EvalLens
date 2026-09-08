import { createBrowserRouter, Navigate } from 'react-router-dom'
import Dashboard from './pages/Dashboard/Dashboard'
import Datasets from './pages/Datasets/Datasets'
import PromptIde from './pages/PromptIde/PromptIde'

export const routes = {
  dashboard: '/',
  datasets: '/datasets',
  promptIde: '/prompt-ide',
} as const

export const router = createBrowserRouter([
  { path: routes.dashboard, element: <Dashboard /> },
  { path: routes.datasets, element: <Datasets /> },
  { path: routes.promptIde, element: <PromptIde /> },
  { path: '*', element: <Navigate replace to={routes.dashboard} /> },
])
