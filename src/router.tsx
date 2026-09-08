import { createBrowserRouter, Navigate } from 'react-router-dom'
import Dashboard from './pages/Dashboard/Dashboard'
import Datasets from './pages/Datasets/Datasets'
import PromptIde from './pages/PromptIde/PromptIde'
import { routes } from './routes'

export const router = createBrowserRouter([
  { path: routes.dashboard, element: <Dashboard /> },
  { path: routes.datasets, element: <Datasets /> },
  { path: routes.promptIde, element: <PromptIde /> },
  { path: '*', element: <Navigate replace to={routes.dashboard} /> },
])
