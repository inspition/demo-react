import { weatherforecast } from '@/api'
import type { API } from '@/types/api'
import {
  Alert,
  Button,
  Card,
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
import { useEffect, useMemo, useState } from 'react'
import { Prism } from 'react-syntax-highlighter'
import { coy } from 'react-syntax-highlighter/dist/esm/styles/prism'

import output from '@/assets/output.json'
import { CesiumWrap, CommonCharts } from '@/components'
import { fetchWeather } from '@/api/meteo'
// import { AddedEntity } from '@/components/cesium'

export default function ChardtsDemo() {
  //------------天气查询
  const [loading, setLoading] = useState<boolean>(false)
  const [extensions, setExtensions] = useState<'base' | 'all'>('base')
  const [weatherStr, setWeather] = useState<API.WeatherResponse>()
  // const [meteoData, setMeteoData] = useState<API.MinMax[]>()
  const [meteoData, setMeteoData] = useState<API.Cast[]>()
  const [city, setCity] = useState<string>('350200')
  // 高德天气整理
  const weaAMP = useMemo(
    () => weatherStr?.forecasts?.flatMap(v => v.casts) ?? [],
    [weatherStr]
  ) as API.Cast[]
  // 组合高德、open-meteo天气数据
  const combData = useMemo(() => {
    const comb = [...(weaAMP ?? []), ...(meteoData ?? [])] as API.Cast[]

    return comb.sort((a, b) => (a?.date === b?.date ? -1 : 1))
  }, [weatherStr, meteoData])

  const options: CheckboxGroupProps<string>['options'] = [
    { label: '实况天气', value: 'base' },
    { label: '预报天气', value: 'all' },
  ]
  const areaOptions: SelectProps['options'] = output.map(
    ({ label, adcode, citycode }) => ({ label, value: adcode, citycode })
  )
  function onChange(e: RadioChangeEvent) {
    setExtensions(e.target.value)
    // searchWeather()
  }
  const onAreaChange: SelectProps['onChange'] = value => {
    setCity(value)
    // searchWeather()
  }
  // 高德天气
  async function searchWeather() {
    setLoading(true)
    setWeather(undefined)

    const data = await weatherforecast({ city, extensions })

    setWeather(data)
    setLoading(false)

    // fetchWeather()
    // apiOpemMeteo({
  }
  // open-meteo天气
  async function fetchMeteoWeather(
    position = { latitude: 24.3125, longitude: 118 }
  ) {
    setLoading(true)
    setMeteoData(undefined)

    const { data } = await fetchWeather({
      latitude: position.latitude,
      longitude: position.longitude,
      hourly: 'temperature_2m',
      forecast_days: '10',
      models: 'cma_grapes_global',
      format: 'json',
      timeformat: 'unixtime',
    })

    const minMaxMap: Map<string, API.MinMax> = new Map()
    const map = data
      ?.filter(v => v.temperature2m !== 'NaN')
      ?.map(v => ({ ...v, date: v.date?.slice(0, 9) }))
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
    const list: API.Cast[] = [...minMaxMap.values()].map(
      ({ date, min, max }) => ({
        date,
        daytemp_float: max + '',
        nighttemp_float: min + '',

        daypower: '',
        daytemp: '',
        dayweather: '',
        daywind: '',
        nightpower: '',
        nighttemp: '',
        nightweather: '',
        nightwind: '',
        week: '',
      })
    )

    setMeteoData(list)
    setLoading(false)
  }
  // function onMapAdded(entity: AddedEntity) {
  //   fetchMeteoWeather(entity)
  // }
  //------------天气查询 end

  useEffect(() => {
    if (extensions || city) searchWeather()
    fetchMeteoWeather()
    console.log(import.meta.env, import.meta.env.VITE_BASE_URL)

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [extensions, city])

  const tabItems: TabsProps['items'] = [
    {
      key: '1',
      label: '天气查询',
      destroyInactiveTabPane: true,
      children: (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <Row align={'middle'} style={{ gap: 20 }}>
            <span>气象类型：</span>

            {/* <Flex vertical gap="middle">
            </Flex> */}

            <Radio.Group
              value={extensions}
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
              {/* <Button disabled={!weatherStr}>JSON</Button> */}

              <Button disabled={!meteoData}>JSON</Button>
            </Popover>
          </Row>

          {/* <Row></Row> */}

          <Skeleton loading={loading} paragraph={{ rows: 10 }} active>
            {weaAMP.length ? (
              <Card title="高德天气API">
                <Row justify="space-between">
                  <Col span={24} lg={12} xl={8}>
                    <CommonCharts.BarChart
                      data={combData}
                      style={{ width: '100%', height: '50vh' }}
                    />
                  </Col>

                  <Col span={24} lg={12} xl={8}>
                    <CommonCharts.LinesChart
                      data={weaAMP}
                      style={{ width: '100%', height: '50vh' }}
                    />
                  </Col>

                  <Col span={24} lg={12} xl={8}>
                    <CommonCharts.DistributionCharts
                      data={weaAMP}
                      style={{ width: '100%', height: '50vh' }}
                    />
                  </Col>
                </Row>
              </Card>
            ) : null}

            {weatherStr?.lives?.map(v => (
              <CommonCharts.Dashboard data={v} key={v.adcode} />
            ))}
          </Skeleton>
        </div>
      ),
    },
    {
      key: '2',
      label: '地图天气',
      destroyInactiveTabPane: true,
      children: (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <Row justify="space-between" style={{ flexDirection: 'column' }}>
            <Card title="Open-Meteo: 这是一个开源天气 API，可供非商业用途免费使用。无需 API 密钥, 开箱即用">
              <Row gutter={20}>
                <Col
                  span={24}
                  lg={12}
                  style={{ width: '100%', height: '30vh' }}
                >
                  <Skeleton loading={loading} paragraph={{ rows: 7 }} active>
                    <CommonCharts.BarChart
                      data={meteoData ?? []}
                      style={{ width: '100%', height: '100%' }}
                    />
                  </Skeleton>
                </Col>

                <Col
                  span={24}
                  lg={12}
                  style={{ width: '100%', height: '30vh' }}
                >
                  <Skeleton loading={loading} paragraph={{ rows: 7 }} active>
                    <CommonCharts.LinesChart
                      data={meteoData ?? []}
                      style={{ width: '100%', height: '100%' }}
                    />
                  </Skeleton>
                </Col>

                <Alert
                  style={{ width: '100%' }}
                  // message="提示"
                  type="info"
                  description="在地图中点击任意位置显示当地天气预报"
                  // showIcon
                  closable
                />

                <CesiumWrap
                  onAdded={fetchMeteoWeather}
                  style={{ height: '60vh' }}
                />
              </Row>
            </Card>
          </Row>
        </div>
      ),
    },
  ]

  return (
    <Tabs defaultActiveKey="1" items={tabItems} animated={{ tabPane: true }} />
  )
}
