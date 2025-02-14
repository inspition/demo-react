// import App from "@/App";
import { lazy } from 'react'
import { PathRouteProps } from 'react-router'

interface RouteProps extends PathRouteProps {
  meta?: {
    title?: string

    [key: string]: unknown
  }
}

const App = lazy(() => import('@/App'))
const ChartsDemo = lazy(() => import('@/views/ChartsDemo'))

/**
 * 路由配置
 *
 * @type {PathRouteProps[]}
 */
export const routes: RouteProps[] = [
  { path: '/', element: <App />, meta: { title: 'home' } },
  { path: '/charts', element: <ChartsDemo />, meta: { title: 'charts' } },
]
