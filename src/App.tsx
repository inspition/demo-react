import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { formateDate } from '@/utils'
import CanvasRenderer from '@/components/canvas'

function App() {
  const [count, setCount] = useState(0)

  function click() {
    setCount((count) => count + 1)
    console.log(formateDate(new Date().toString()));
  }

  return (
    <>
      <CanvasRenderer />

      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h4>Vite + React</h4>
      <div className="card">
        <button onClick={click}>
          count is {count} inspition
        </button>
      </div>
    </>
  )
}

export default App
