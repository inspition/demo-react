// import App from "@/App";
import { lazy } from "react";
import { PathRouteProps } from "react-router";

const App = lazy(() => import('@/App'))
const ChartsDemo = lazy(() => import('@/views/ChartsDemo'))

/**
 * 路由配置
 *
 * @type {PathRouteProps[]}
 */
export const routes: PathRouteProps[] = [
  { path: '/', element: <App /> },
  { path: '/charts', element: <ChartsDemo /> }
]