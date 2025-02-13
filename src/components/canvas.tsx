import React from "react";
import { useEffect, useRef } from "react";

interface Positives {
  x: number;
  y: number;
}

function CanvasRenderer() {
  const ref = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = ref.current
    if (canvas) initCanvas(canvas)
  }, []) // 确保只在组件挂载时执行一次

  function initCanvas(canvas: HTMLCanvasElement) {
    const ctx = canvas.getContext('2d')
    canvas.width = 800;
    canvas.height = 600;

    // 配置参数
    const config = {
      centerX: canvas.width / 2,
      centerY: canvas.height / 2,
      hexRadius: 200,
      ballRadius: 10,
      gravity: 0.5,
      airResistance: 0.99,
      rotationSpeed: 0.02,
      restitution: 1.85,
      friction: 0.7
    };

    // 初始化状态
    const state = {
      ballX: config.centerX,
      ballY: config.centerY - config.hexRadius + config.ballRadius + 20,
      vx: 2,
      vy: 0,
      hexRotation: 0
    };

    // 绘制六边形
    function drawHexagon(ctx: CanvasRenderingContext2D) {
      ctx.beginPath();
      for (let i = 0; i < 6; i++) {
        const angle = state.hexRotation + i * Math.PI / 3;
        const x = config.centerX + config.hexRadius * Math.cos(angle);
        const y = config.centerY + config.hexRadius * Math.sin(angle);

        if (!i) {
          ctx.moveTo(x, y)
        } else {
          ctx.lineTo(x, y);
        }

      }
      ctx.closePath();
      ctx.strokeStyle = '#000';
      ctx.stroke();
    }

    // 绘制球
    function drawBall() {
      if (!ctx) return;

      ctx.beginPath();
      ctx.arc(state.ballX, state.ballY, config.ballRadius, 0, Math.PI * 2);
      ctx.fillStyle = 'red';
      ctx.fill();
    }

    // 碰撞检测
    function checkCollision(a: Positives, b: Positives) {
      const ab = { x: b.x - a.x, y: b.y - a.y };
      const ap = { x: state.ballX - a.x, y: state.ballY - a.y };
      const t = Math.max(0, Math.min(1, (ap.x * ab.x + ap.y * ab.y) / (ab.x ** 2 + ab.y ** 2)));

      const nearest = {
        x: a.x + t * ab.x,
        y: a.y + t * ab.y
      };

      const dx = state.ballX - nearest.x;
      const dy = state.ballY - nearest.y;
      const distance = Math.sqrt(dx ** 2 + dy ** 2);

      if (distance > config.ballRadius) return null;

      let normal = { x: ab.y, y: -ab.x };
      const mid = {
        x: (a.x + b.x) / 2,
        y: (a.y + b.y) / 2
      };
      const dot = normal.x * (mid.x - config.centerX) + normal.y * (mid.y - config.centerY);
      if (dot > 0) normal = { x: -normal.x, y: -normal.y };

      const length = Math.sqrt(normal.x ** 2 + normal.y ** 2);
      return {
        normal: { x: normal.x / length, y: normal.y / length },
        overlap: config.ballRadius - distance
      };
    }

    // 处理碰撞
    function handleCollision(collision: { normal: Positives; overlap: number; }) {
      const n = collision.normal;
      const vn = (state.vx * n.x + state.vy * n.y);

      // 更新速度
      state.vx = (state.vx - (1 + config.restitution) * vn * n.x) * config.friction;
      state.vy = (state.vy - (1 + config.restitution) * vn * n.y) * config.friction;

      // 修正位置
      state.ballX += n.x * collision.overlap * 1.1;
      state.ballY += n.y * collision.overlap * 1.1;
    }

    // 动画循环
    function animate() {
      if (!ctx) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // 更新状态
      state.hexRotation += config.rotationSpeed;
      state.vy += config.gravity;
      state.vx *= config.airResistance;
      state.vy *= config.airResistance;
      state.ballX += state.vx;
      state.ballY += state.vy;

      // 生成六边形顶点
      const vertices = [];
      for (let i = 0; i < 6; i++) {
        const angle = state.hexRotation + i * Math.PI / 3;
        vertices.push({
          x: config.centerX + config.hexRadius * Math.cos(angle),
          y: config.centerY + config.hexRadius * Math.sin(angle)
        });
      }

      // 检测和处理碰撞
      for (let i = 0; i < 6; i++) {
        const collision = checkCollision(
          vertices[i],
          vertices[(i + 1) % 6]
        );
        if (collision) {
          handleCollision(collision);
          break;
        }
      }

      drawHexagon(ctx);
      drawBall();
      requestAnimationFrame(animate);
    }

    animate();
  }

  return (
    <canvas ref={ref} width={800} height={600} />
  )
}

export default React.memo(CanvasRenderer)