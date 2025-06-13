import { memo } from 'react'
import { useEffect, useRef } from 'react'

interface Positives {
  x: number
  y: number
}

function CanvasRenderer() {
  const ref = useRef<HTMLCanvasElement>(null)
  const callback = useRef<(ctx: CanvasRenderingContext2D) => void>(null)

  // 画布配置
  const canvasConf = { width: 1200, height: 800 }
  // 配置参数
  const config = {
    /** 画布中心X坐标 */
    centerX: canvasConf.width / 2,
    /** 画布中心Y坐标 */
    centerY: canvasConf.height / 2,
    /** 六边形半径 */
    hexRadius: 200,
    /** 球半径 */
    ballRadius: 10,
    /** 重力加速度 0.5 */
    gravity: 0.5,
    /** 空气阻力 0.99 */
    airResistance: 0.99,
    /** 六边形旋转速度 0.02 */
    rotationSpeed: 0.02,
    /** 碰撞恢复系数 0.8 */
    restitution: 1.85,
    /** 摩擦系数 0.7 */
    friction: 0.7,
  }

  // 障碍物配置
  const obstacleConf = useRef({
    x: 0,
    y: 500,
    width: 150,
    height: 150,

    // 移动中
    onMove: false,
  })

  const setObConf = (newConf: Partial<typeof obstacleConf.current>) => {
    obstacleConf.current = { ...obstacleConf.current, ...newConf }
  }

  useEffect(() => {
    const canvas = ref.current
    if (canvas) initCanvas(canvas)

    return () => destoryListeners(canvas!)
  }, []) // 确保只在组件挂载时执行一次

  function initCanvas(canvas: HTMLCanvasElement) {
    const ctx = canvas.getContext('2d')
    canvas.width = canvasConf.width
    canvas.height = canvasConf.height

    addListeners(canvas)

    // 初始化状态
    const state = {
      ballX: config.centerX,
      ballY: config.centerY - config.hexRadius + config.ballRadius + 20,
      vx: 2,
      vy: 0,
      hexRotation: 0,
    }

    // 绘制六边形
    function drawHexagon(ctx: CanvasRenderingContext2D) {
      ctx.beginPath()
      for (let i = 0; i < 6; i++) {
        const angle = state.hexRotation + (i * Math.PI) / 3
        const x = config.centerX + config.hexRadius * Math.cos(angle)
        const y = config.centerY + config.hexRadius * Math.sin(angle)

        if (!i) {
          ctx.moveTo(x, y)
        } else {
          ctx.lineTo(x, y)
        }
      }
      ctx.closePath()
      ctx.strokeStyle = '#000'
      ctx.stroke()
    }

    // 绘制球
    function drawBall() {
      if (!ctx) return

      ctx.beginPath()
      ctx.arc(state.ballX, state.ballY, config.ballRadius, 0, Math.PI * 2)
      ctx.fillStyle = 'red'
      ctx.fill()
    }

    // 绘制障碍物
    function drawObstacle() {
      if (!ctx) return

      ctx.lineWidth = 5

      ctx.beginPath()

      ctx.moveTo(0 + obstacleConf.current.x, 0 + obstacleConf.current.y)
      ctx.lineTo(
        obstacleConf.current.width + obstacleConf.current.x,
        obstacleConf.current.height + obstacleConf.current.y
      )
      ctx.closePath()

      ctx.stroke()
    }

    // 碰撞检测
    function checkCollision(a: Positives, b: Positives) {
      const ab = { x: b.x - a.x, y: b.y - a.y }
      const ap = { x: state.ballX - a.x, y: state.ballY - a.y }
      const t = Math.max(
        0,
        Math.min(1, (ap.x * ab.x + ap.y * ab.y) / (ab.x ** 2 + ab.y ** 2))
      )

      const nearest = {
        x: a.x + t * ab.x,
        y: a.y + t * ab.y,
      }

      const dx = state.ballX - nearest.x
      const dy = state.ballY - nearest.y
      const distance = Math.sqrt(dx ** 2 + dy ** 2)

      if (distance > config.ballRadius) return null

      let normal = { x: ab.y, y: -ab.x }
      const mid = {
        x: (a.x + b.x) / 2,
        y: (a.y + b.y) / 2,
      }
      const dot =
        normal.x * (mid.x - config.centerX) +
        normal.y * (mid.y - config.centerY)
      if (dot > 0) normal = { x: -normal.x, y: -normal.y }

      const length = Math.sqrt(normal.x ** 2 + normal.y ** 2)
      return {
        normal: { x: normal.x / length, y: normal.y / length },
        overlap: config.ballRadius - distance,
      }
    }

    // 处理碰撞
    function handleCollision(collision: {
      normal: Positives
      overlap: number
    }) {
      const n = collision.normal
      const vn = state.vx * n.x + state.vy * n.y

      // 更新速度
      state.vx =
        (state.vx - (1 + config.restitution) * vn * n.x) * config.friction
      state.vy =
        (state.vy - (1 + config.restitution) * vn * n.y) * config.friction

      // 修正位置
      state.ballX += n.x * collision.overlap * 1.1
      state.ballY += n.y * collision.overlap * 1.1
    }

    // 动画循环
    function animate() {
      if (!ctx) return

      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // 更新状态
      state.hexRotation += config.rotationSpeed
      state.vy += config.gravity
      state.vx *= config.airResistance
      state.vy *= config.airResistance
      state.ballX += state.vx
      state.ballY += state.vy

      // 生成六边形顶点
      const vertices = []
      for (let i = 0; i < 6; i++) {
        const angle = state.hexRotation + (i * Math.PI) / 3
        vertices.push({
          x: config.centerX + config.hexRadius * Math.cos(angle),
          y: config.centerY + config.hexRadius * Math.sin(angle),
        })
      }

      // 检测和处理碰撞
      for (let i = 0; i < 6; i++) {
        const collision = checkCollision(vertices[i], vertices[(i + 1) % 6])
        if (collision) {
          handleCollision(collision)
          break
        }
      }

      drawHexagon(ctx)
      drawBall()
      drawObstacle()
      callback.current?.(ctx)
      requestAnimationFrame(animate)
    }

    animate()
  }

  // 添加事件监听
  function addListeners(canvas: HTMLCanvasElement) {
    canvas.addEventListener('mousemove', handleMouse)
    canvas.addEventListener('mousedown', handleMouse)
    canvas.addEventListener('mouseup', handleMouse)
  }
  function handleMouse(ev: MouseEvent) {
    const { movementX, movementY } = ev ?? {}
    const conf = obstacleConf.current
    // console.log({ movementX, movementY, offsetX, offsetY })

    switch (ev.type) {
      case 'mousedown':
        setObConf({ onMove: true })
        break

      case 'mouseup':
        setObConf({ onMove: false })
        break

      case 'mousemove':
        if (obstacleConf.current.onMove && checkBoundary(ev)) {
          setObConf({
            x: conf.x + movementX,
            y: conf.y + movementY,
          })
        }
        break
    }
  }

  /**
   * 检查是否处于画布范围
   *
   * @param {MouseEvent} ev
   * @returns {boolean}
   */
  function checkBoundary(ev: MouseEvent): boolean {
    const { offsetX, offsetY } = ev ?? {}

    // 处于画布范围
    const valid =
      offsetX >= 0 &&
      offsetX <= canvasConf.width &&
      offsetY >= 0 &&
      offsetY <= canvasConf.height

    // 不在画布范围时，取消移动状态
    if (!valid) {
      console.log('超出了', { offsetX, offsetY })

      setObConf({ onMove: false })
    }

    return valid
  }
  function destoryListeners(canvas: HTMLCanvasElement) {
    canvas?.removeEventListener('mousemove', handleMouse)
    canvas?.removeEventListener('mousedown', handleMouse)
    canvas?.removeEventListener('mouseup', handleMouse)
  }

  return (
    <>
      <canvas
        ref={ref}
        style={{ border: '1px solid #999', borderRadius: '5px' }}
      />
    </>
  )
}

export default memo(CanvasRenderer)
