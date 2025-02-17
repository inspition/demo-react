import { API } from '@/types/api'
import { Chart } from '@antv/g2'
import { HTMLAttributes, useEffect, useRef } from 'react'

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
    // .axis('x', { title: { text: '日期' } })
    // .axis('y', { title: { text: '温度' } })

    chart.render()
  }

  return <div {...props} ref={container}></div>
}

/**
 * 双折线对比图
 *
 * @export
 * @param {{ data: API.Cast[] }} param0
 * @param {{}} param0.data
 * @returns {*}
 */
export function DoubleLineChart({ data }: { data: API.Cast[] }) {
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

  return <div ref={container}></div>
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

    chart.axis('x', { title: '天气类型' })
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
