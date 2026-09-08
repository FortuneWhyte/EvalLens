import { createBrowserRouter, Navigate } from 'react-router-dom'
import Dashboard from './pages/Dashboard/Dashboard'
import Datasets from './pages/Datasets/Datasets'
import Evals from './pages/Evals/Evals'
import Logs from './pages/Logs/Logs'
import Models from './pages/Models/Models'
import PromptIde from './pages/PromptIde/PromptIde'
import { routes } from './routes'

export const router = createBrowserRouter([
  { path: routes.dashboard, element: <Dashboard /> },
  { path: routes.evals, element: <Evals /> },
  { path: routes.datasets, element: <Datasets /> },
  { path: routes.logs, element: <Logs /> },
  { path: routes.models, element: <Models /> },
  { path: routes.promptIde, element: <PromptIde /> },
  { path: '*', element: <Navigate replace to={routes.dashboard} /> },
])
