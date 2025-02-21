import { API } from '@/types/api'
import { Chart } from '@antv/g2'
import { Card, Col, Row, Statistic } from 'antd'
import {
  // CSSProperties,
  HTMLAttributes,
  useEffect,
  useMemo,
  useRef,
} from 'react'

const emojiMap: Record<string, string> = {
  晴: '☀️',
  阴: '☁️',
  雨: '🌧️',
  雪: '❄️',
  雾: '🌫️',
  多云: '⛅',
  小雨: '🌧️',
}

/**
 * 柱状图
 *
 * @export
 * @param {{ data: API.Cast[] }} param0
 * @param {{}} param0.data
 * @returns {React.JSX.IntrinsicElements.div}
 */
export function BarChart({
  data,
  ...props
}: { data: API.Cast[] } & HTMLAttributes<HTMLDivElement>) {
  const container = useRef(null)

  useEffect(() => {
    if (container.current) init(container.current)
  }, [data])

  function init(container: HTMLElement) {
    const chart = new Chart({ container, autoFit: true })

    // chart.interval().data(data).encode('x', 'date').encode('y', 'daytemp')

    // 将数据转换为适合图表的数据格式
    const transformedData = data.flatMap(item => [
      {
        日期: item.date,
        温度: parseFloat(item.daytemp_float),
        type: '最高气温',
      },
      {
        日期: item.date,
        温度: parseFloat(item.nighttemp_float),
        type: '最低气温',
      },
    ])

    chart.data(transformedData)

    chart.scale('温度', {
      min: 0,
    })

    chart
      .interval()
      .encode('x', '日期')
      .encode('y', '温度')
      .encode('color', 'type')
      .axis('x', { labelFormatter: (d: string) => d?.slice(5) })
    // .axis('y', { title: { text: '温度' } })

    chart.render()
  }

  return <div {...props} ref={container}></div>
}

/**
 * 多折线对比图
 *
 * @export
 * @param {{ data: API.Cast[] }} param0
 * @param {{}} param0.data
 * @returns {*}
 */
export function LinesChart({
  data,
  ...props
}: { data: API.Cast[] } & HTMLAttributes<HTMLDivElement>) {
  const container = useRef(null)

  useEffect(() => {
    if (container.current) init(container.current)
  }, [data])

  function init(container: HTMLElement) {
    const chart = new Chart({ container, autoFit: true })

    const transformedData = data.flatMap(item => [
      {
        日期: item.date,
        温度: parseFloat(item.daytemp_float),
        type: '最高气温',
      },
      {
        日期: item.date,
        温度: parseFloat(item.nighttemp_float),
        type: '最低气温',
      },
    ])

    chart
      .data(transformedData)
      .encode('x', '日期')
      .encode('y', '温度')
      .encode('color', 'type')
      .scale('x', {
        range: [0, 1],
      })
      .scale('y', {
        nice: true,
      })
      .axis('y', { labelFormatter: (d: string) => d + '°C' })

    chart.line().encode('shape', 'smooth')

    chart.point().encode('shape', 'point').tooltip(false)

    chart.render()
  }

  return <div {...props} ref={container}></div>
}

/**
 * 折线图
 *
 * @export
 * @param {{ data: API.Cast[] }} param0
 * @param {{}} param0.data
 * @returns {*}
 */
export function LineChart({ data }: { data: API.MinMax[] }) {
  const container = useRef(null)

  useEffect(() => {
    if (container.current) init(container.current)
  }, [data])

  function init(container: HTMLElement) {
    const chart = new Chart({ container, autoFit: true })

    const transformedData = data.flatMap(item => [
      {
        日期: item.date,
        温度: parseFloat(item.max + ''),
        type: '最高气温',
      },
      {
        日期: item.date,
        温度: parseFloat(item.min + ''),
        type: '最低气温',
      },
    ])

    chart
      .data(transformedData)
      .encode('x', '日期')
      .encode('y', '温度')
      .encode('color', 'type')
      .scale('x', {
        range: [0, 1],
      })
      .scale('y', {
        nice: true,
      })
      .axis('x', { tickCount: 5 })
      .axis('y', { labelFormatter: (d: string) => d + '°C' })

    chart.line().encode('shape', 'smooth')

    chart.point().encode('shape', 'point').tooltip(false)

    chart.render()
  }

  return <div ref={container}></div>
}

/**
 * 分布图
 *
 * @export
 * @param {{ data: API.Cast[] }} param0
 * @param {{}} param0.data
 * @returns {*}
 */
export function DistributionCharts({
  data,
  ...props
}: { data: API.Cast[] } & HTMLAttributes<HTMLDivElement>) {
  const container = useRef(null)

  useEffect(() => {
    if (container.current) init(container.current)
  }, [data])

  function init(container: HTMLElement) {
    const chart = new Chart({ container, autoFit: true })

    // 统计天气出现次数
    const weatherCount = data.reduce((acc, item) => {
      acc[item.dayweather] = (acc[item.dayweather] || 0) + 1
      acc[item.nightweather] = (acc[item.nightweather] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    chart
      .data(
        Object.entries(weatherCount).map(([weather, count]) => ({
          weather,
          count,
        }))
      )
      .coordinate({ transform: [{ type: 'transpose' }] }) // 横向条形图
      .encode('x', 'weather')
      .encode('y', 'count')
      .encode('color', 'weather')
      .legend('color', false)

    chart
      .interval()
      .tooltip({ items: ['weather', 'count'] })
      .style('fillOpacity', 0.8)
      .style('lineWidth', 1)

    chart.axis('x', {
      title: '天气类型',
      labelFormatter: (v: string) => emojiMap[v] ?? v,
      labelFontSize: 20,
    })
    chart.axis('y', { title: '出现次数' })

    chart.render()
  }

  return <div {...props} ref={container}></div>
}

/**
 * 风力组合
 *
 * @export
 * @param {({ data: API.Cast[] } & HTMLAttributes<HTMLDivElement>)} param0
 * @param {*} param0.data
 * @param {*} param0....props
 * @returns {*}
 */
export function WindCharts({
  data,
  ...props
}: { data: API.Cast[] } & HTMLAttributes<HTMLDivElement>) {
  const container = useRef(null)

  useEffect(() => {
    if (container.current) init(container.current)
  }, [data])

  function init(container: HTMLElement) {
    const windData = data.map(item => ({
      date: item.date,
      direction: item.daywind,
      power: parseInt(item.daypower.split('-')[0]),
    }))

    const chart = new Chart({ container, autoFit: true })

    chart
      .data(windData)
      .encode('x', 'date')
      .encode('y', 'power')
      .encode('color', 'direction')
      .scale('y', { zero: true, nice: true })

    chart
      .interval()
      .encode('series', 'direction')
      .style('radius', [4, 4, 0, 0])
      .tooltip({ items: ['date', 'direction', 'power'] })

    chart.axis('y', { title: '风力等级' })
    chart.axis('x', { title: false })

    chart.render()
  }

  return <div {...props} ref={container}></div>
}

/**
 * 柱线混合
 *
 * @export
 * @param {({ data: API.Cast[] } & HTMLAttributes<HTMLDivElement>)} param0
 * @param {*} param0.data
 * @param {*} param0....props
 * @returns {*}
 */
export function DualLineChart({
  data,
  ...props
}: { data: API.Cast[] } & HTMLAttributes<HTMLDivElement>) {
  const container = useRef(null)

  useEffect(() => {
    if (container.current) init(container.current)
  }, [data])

  function init(container: HTMLElement) {
    const chart = new Chart({ container, autoFit: true })

    const transformedData = data.flatMap(item => [
      {
        日期: item.date,
        温度: parseFloat(item.max + ''),
        type: '最高气温',
      },
      {
        日期: item.date,
        温度: parseFloat(item.min + ''),
        type: '最低气温',
      },
    ])

    chart.data(transformedData)

    chart
      .interval()
      .encode('x', '日期')
      .encode('y', '温度')
      .axis('y', { title: '温度', titleFill: '#5B8FF9' })

    chart
      .line()
      .encode('x', '日期')
      .encode('y', '温度')
      .encode('shape', 'smooth')
      .style('stroke', '#fdae6b')
      .style('lineWidth', 2)
      .scale('y', { independent: true })
      .axis('y', {
        position: 'right',
        grid: null,
        title: '温度',
        titleFill: '#fdae6b',
      })

    chart.render()
  }

  return <div {...props} ref={container}></div>
}

/**
 * 通用图表
 *
 * @export
 * @param {({ data: API.Cast[] } & HTMLAttributes<HTMLDivElement>)} param0
 * @param {*} param0.data
 * @param {*} param0....props
 * @returns {*}
 */
export function CommonChart({
  data,
  ...props
}: { data: API.Cast[] } & HTMLAttributes<HTMLDivElement>) {
  const container = useRef(null)

  useEffect(() => {
    if (container.current) init(container.current)
  }, [data])

  function init(container: HTMLElement) {
    const chart = new Chart({ container, autoFit: true })

    const transformedData = data.flatMap(item => [
      {
        日期: item.date,
        温度: parseFloat(item.daytemp_float),
        type: '最高气温',
      },
      {
        日期: item.date,
        温度: parseFloat(item.nighttemp_float),
        type: '最低气温',
      },
    ])

    chart.data(transformedData)

    chart
      .area()
      .encode('x', '日期')
      .encode('y', '温度')
      .encode('shape', 'smooth')
    // .animate({ appear: { animation: 'fadeIn', duration: 1000 } })

    // 叠加折线
    chart
      .line()
      .encode('x', '日期')
      .encode('y', '温度')
      .encode('shape', 'smooth')

    chart.render()
  }

  return <div {...props} ref={container}></div>
}

/**
 * 仪表盘
 *
 * @export
 * @param {({ data: API.Life } & HTMLAttributes<HTMLDivElement>)} param0
 * @param {*} param0.data
 * @param {*} param0....props
 * @returns {*}
 */
export function Dashboard({
  data,
  ...props
}: { data: API.Life } & HTMLAttributes<HTMLDivElement>) {
  const container = useRef(null)

  useEffect(() => {
    if (container.current) init(container.current)
  }, [data])

  function init(container: HTMLElement) {
    // 主标题
    // chart.annotation().text({
    //   position: ['50%', '10%'],
    //   content: `${data.city} · ${data.weather}`,
    //   style: { fontSize: 24, textAlign: 'center' },
    // })

    // 温度仪表盘
    const tempChart = new Chart({ container, autoFit: true })
    tempChart.options({
      type: 'gauge',
      autoFit: true,
      data: {
        value: {
          target: data.temperature_float,
          total: 70,
          thresholds: [23, 46, 70],
          name: '°C',
        },
      },
      scale: { color: { range: ['gray', '#FAAD14', '#F4664A'] } },
      style: {
        arcShape: 'round',
        arcLineWidth: 2,
        textContent: (target: number) => `温度：${target}°C`,
      },
      legend: false,
    })
    tempChart.render()
    // .style('text', { fontSize: 24 })

    // 湿度仪表盘
    const humidityChart = new Chart({ container: 'humidity-container' })
    humidityChart.options({
      type: 'liquid',
      autoFit: true,
      data: Number(data?.humidity ?? 0) / 100,
      style: {
        contentText: `湿度：${data?.humidity_float}%`,
        contentFill: '#fff',
        outlineBorder: 4,
        outlineDistance: 8,
        waveLength: 128,
      },
    })
    humidityChart.render()
  }

  const weatherFormat = useMemo(
    () => `${emojiMap[data.weather ?? ''] ?? data.weather}${data.weather}`,
    [data]
  )

  const addressFormat = useMemo(() => `${data.province} - ${data.city}`, [data])
  // const textCenter: CSSProperties = { textAlign: 'center' }

  return (
    <>
      <Row justify="space-around" align="middle" gutter={16}>
        <Col span={12}>
          <div {...props} ref={container}></div>
        </Col>

        <Col span={10}>
          <div id="humidity-container" {...props}></div>
        </Col>
      </Row>

      <Card>
        <Row align="middle" gutter={16}>
          <Col span={8}>
            <Statistic title="时间" value={data.reporttime} />
          </Col>

          <Col span={8}>
            <Statistic title="地区" value={addressFormat} />
          </Col>

          <Col span={8}>
            <Statistic title="天气" value={weatherFormat} />
          </Col>

          <Col span={8}>
            <Statistic title="风向" value={data.winddirection} />
          </Col>

          <Col span={8}>
            <Statistic title="风力" value={data.windpower} />
          </Col>
        </Row>
      </Card>
    </>
  )
}
