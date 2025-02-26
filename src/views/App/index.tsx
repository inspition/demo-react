import { Canvas } from '@/components'
import { Row } from 'antd'
import './index.css'

function App() {
  return (
    <Row justify="center" align="middle" style={{ minHeight: '50vh' }}>
      <Canvas />
    </Row>
  )
}

export default App
