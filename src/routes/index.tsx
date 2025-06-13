// import App from "@/App";
import { lazy } from 'react'
import { PathRouteProps } from 'react-router'

interface RouteProps extends PathRouteProps {
  meta?: {
    title?: string

    [key: string]: unknown
  }
}

const BocceBall = lazy(() => import('@/views/BocceBall'))
const ChartsDemo = lazy(() => import('@/views/ChartsDemo'))
const ConfComps = lazy(() => import('@/views/ConfComps'))

/**
 * 路由配置
 *
 * @type {PathRouteProps[]}
 */
export const routes: RouteProps[] = [
  { path: '', element: <ChartsDemo />, meta: { title: '天气可视化' } },
  { path: 'bocce-ball', element: <BocceBall />, meta: { title: '画布滚动球' } },
  { path: 'conf-comps', element: <ConfComps />, meta: { title: '配置化组件库' } },
]
