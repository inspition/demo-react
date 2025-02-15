import { indexData, weatherforecast } from '@/api'
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
import { fetchWeatherApi } from 'openmeteo'

export default function ChardtsDemo() {
  // 请求演示
  const [content, setContent] = useState<API.Data>()
  async function handleClick() {
    setContent(undefined)

    const { data } = await indexData()

    setContent(data)
    // console.log(import.meta.env)
  }

  // 天气查询
  const [loading, setLoading] = useState<boolean>(false)
  const [extensions, setExtensions] = useState<'base' | 'all'>('base')
  const [weatherStr, setWeather] = useState<API.WeatherResponse>()
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

    fetchWeather()
  }
  async function fetchWeather() {
    const params = {
      latitude: 52.52,
      longitude: 13.41,
      hourly: 'temperature_2m',
      models: 'cma_grapes_global',
    }
    const url = 'https://api.open-meteo.com/v1/forecast'
    const responses = await fetchWeatherApi(url, params)

    // Helper function to form time ranges
    const range = (start: number, stop: number, step: number) =>
      Array.from({ length: (stop - start) / step }, (_, i) => start + i * step)

    // Process first location. Add a for-loop for multiple locations or weather models
    const response = responses[0]

    // Attributes for timezone and location
    const utcOffsetSeconds = response.utcOffsetSeconds()
    // const timezone = response.timezone()
    // const timezoneAbbreviation = response.timezoneAbbreviation()
    const latitude = response.latitude()
    const longitude = response.longitude()

    const hourly = response.hourly()!

    // Note: The order of weather variables in the URL query and the indices below need to match!
    const weatherData = {
      hourly: {
        time: range(
          Number(hourly.time()),
          Number(hourly.timeEnd()),
          hourly.interval()
        ).map(t => new Date((t + utcOffsetSeconds) * 1000)),
        temperature2m: hourly.variables(0)!.valuesArray()!,
      },
    }

    const { time, temperature2m } = weatherData.hourly
    const data = time.map((t, i) => ({
      date: t.toLocaleString(),
      temperature2m: temperature2m[i].toFixed(1),
    }))

    console.log('fetchWeatherApi', responses, {
      data,
      latitude,
      longitude,
    })
  }
  useEffect(() => {
    if (extensions || city) {
      searchWeather()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [extensions, city])

  const tabItems: TabsProps['items'] = [
    {
      key: '1',
      label: '请求演示',
      children: (
        <>
          <Button onClick={handleClick} type="primary">
            请求演示
          </Button>

          <Prism language="json" style={coy}>
            {JSON.stringify(content, null, 2)}
          </Prism>
        </>
      ),
    },
    {
      key: '2',
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

                  <CommonCharts.LineChart data={v?.casts ?? []} />
                </>
              ))}
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
