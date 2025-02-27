import { Canvas } from '@/components'
import { Row } from 'antd'
import './index.css'

export default function CanvasBocceBall() {
  return (
    <Row justify="center" align="middle" style={{ minHeight: '50vh' }}>
      <Canvas />
    </Row>
  )
}
