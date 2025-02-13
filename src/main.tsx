import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.scss'
// import App from './App.tsx'
import { BrowserRouter, Route, Routes } from 'react-router'
import { routes } from '@/routes/index.tsx'
import Layout from '@/layout'

import '@ant-design/v5-patch-for-react-19'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />} >
          {routes.map(r => <Route {...r} key={r.path} />)}
        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>
)
