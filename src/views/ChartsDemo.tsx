import { weatherforecast } from '@/api'
import type { API } from '@/types/api'
import {
  Button,
  Col,
  Popover,
  Radio,
  RadioChangeEvent,
  Row,
  Select,
  SelectProps,
  Skeleton,
  Tabs,
  TabsProps,
} from 'antd'
import { CheckboxGroupProps } from 'antd/es/checkbox'
import { useEffect, useState } from 'react'
import { Prism } from 'react-syntax-highlighter'
import { coy } from 'react-syntax-highlighter/dist/esm/styles/prism'

import output from '@/assets/output.json'
import { CommonCharts } from '@/components'
import { fetchWeather } from '@/api/meteo'

export default function ChardtsDemo() {
  // 请求演示
  // const [content, setContent] = useState<API.Data>()
  // async function handleClick() {
  //   setContent(undefined)

  //   const { data } = await indexData()

  //   setContent(data)
  //   // console.log(import.meta.env)
  // }

  // 天气查询
  const [loading, setLoading] = useState<boolean>(false)
  const [extensions, setExtensions] = useState<'base' | 'all'>('base')
  const [weatherStr, setWeather] = useState<API.WeatherResponse>()
  const [meteoData, setMeteoData] = useState<API.MinMax[]>()
  const options: CheckboxGroupProps<string>['options'] = [
    { label: '实况天气', value: 'base' },
    { label: '预报天气', value: 'all' },
  ]
  const [city, setCity] = useState<string>('350200')
  const areaOptions: SelectProps['options'] = output.map(
    ({ label, adcode, citycode }) => ({ label, value: adcode, citycode })
  )
  function onChange(e: RadioChangeEvent) {
    console.log(`radio checked:${e.target.value}`)
    setExtensions(e.target.value)
    // searchWeather()
  }
  const onAreaChange: SelectProps['onChange'] = (value, option) => {
    console.log(`selected ${value}`, option)
    setCity(value)
    // searchWeather()
  }
  async function searchWeather() {
    setLoading(true)
    setWeather(undefined)

    const data = await weatherforecast({ city, extensions })

    setWeather(data)
    setLoading(false)

    // fetchWeather()
    // apiOpemMeteo({
  }

  async function fetchMeteoWeather() {
    setLoading(true)
    setMeteoData(undefined)

    const { data } = await fetchWeather({
      latitude: 24.3125,
      longitude: 118,
      hourly: 'temperature_2m',
      forecast_days: '10',
      models: 'cma_grapes_global',
      format: 'json',
      timeformat: 'unixtime',
    })

    const minMaxMap: Map<string, API.MinMax> = new Map()
    const map = data?.map(v => ({ ...v, date: v.date?.slice(0, 9) }))
    map.forEach(v => {
      const { date, temperature2m } = v

      if (!minMaxMap.get(date)) {
        minMaxMap.set(date, { min: +temperature2m, max: +temperature2m, date })
      }

      const minMax = minMaxMap.get(date)
      if (!minMax) return

      if (+temperature2m < minMax.min) minMax.min = +temperature2m

      if (+temperature2m > minMax.max) minMax.max = +temperature2m
    })
    const list = [...minMaxMap.values()]

    console.log('meteo:', data, list)

    setMeteoData(list)
    setLoading(false)
  }

  useEffect(() => {
    if (extensions || city) searchWeather()
    fetchMeteoWeather()

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [extensions, city])

  const tabItems: TabsProps['items'] = [
    // {
    //   key: '1',
    //   label: '请求演示',
    //   children: (
    //     <>
    //       <Button onClick={handleClick} type="primary">
    //         请求演示
    //       </Button>

    //       <Prism language="json" style={coy}>
    //         {JSON.stringify(content, null, 2)}
    //       </Prism>
    //     </>
    //   ),
    // },
    {
      key: '1',
      label: '天气查询',
      children: (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <Row align={'middle'} style={{ gap: 20 }}>
            <span>气象类型：</span>

            {/* <Flex vertical gap="middle">
            </Flex> */}
            <Radio.Group
              onChange={onChange}
              options={options}
              defaultValue="base"
              block
            />

            <Col span={3}>
              <Select
                onChange={onAreaChange}
                options={areaOptions}
                defaultValue={[city]}
                style={{ width: '100%' }}
                filterOption={(l, o) =>
                  (o?.label ?? '')?.toString().includes(l)
                }
                showSearch
              />
            </Col>

            <Button onClick={searchWeather} type="primary">
              天气查询
            </Button>

            <Popover
              title="JSON"
              content={
                <Prism
                  language="json"
                  style={{ ...coy }}
                  customStyle={{ height: '500px' }}
                >
                  {JSON.stringify(weatherStr, null, 2)}
                </Prism>
              }
            >
              <Button disabled={!weatherStr}>JSON</Button>
            </Popover>
          </Row>

          <Skeleton loading={loading}>
            <Row>
              {weatherStr?.forecasts?.map(v => (
                <>
                  <CommonCharts.BarChart data={v?.casts ?? []} />

                  <CommonCharts.DoubleLineChart data={v?.casts ?? []} />
                </>
              ))}

              {meteoData?.length && <CommonCharts.LineChart data={meteoData} />}
            </Row>
          </Skeleton>
        </div>
      ),
    },
  ]

  return (
    <Tabs defaultActiveKey="1" items={tabItems} animated={{ tabPane: true }} />
  )
}
