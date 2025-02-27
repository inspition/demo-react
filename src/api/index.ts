import { API, CommonRes } from '@/types/api'
import request from '@/utils/request'
import config from '@/config/index.json'

export async function indexData(): API.InfoRes {
  return request({
    // url: 'https://www.richworld.shop/api/weixin/index/appInfo',
    baseURL: import.meta.env.VITE_BASE_API, // API 的基础 URL,
    url: 'weixin/index/appInfo',
    method: 'GET',
  })
}

/**
 * 天气预报
 *
 * @export
 * @param {{
 *   city: string
 *   extensions?: 'base' | 'all' // base:返回实况天气 all:返回预报天气
 * }} params
 * @returns {*}
 */
export function weatherforecast(params: {
  city: string
  extensions?: 'base' | 'all' // base:返回实况天气 all:返回预报天气
}): API.WeatherRes {
  return request({
    url: 'https://restapi.amap.com/v3/weather/weatherInfo',
    // baseURL: import.meta.env.VITE_WEATHER_API, // API 的基础 URL,
    // url: 'v3/weather/weatherInfo',
    method: 'GET',
    params: {
      ...params,
      key: config.AMP_KEY,
    },
  })
}

/**
 * 根据经纬度获取地区信息
 *
 * @export
 * @param {{
 *   longitude: number
 *   latitude: number
 * }} data
 * @returns {CommonRes<API.LocationRes>}
 */
export function locationToCity(data: {
  longitude: number
  latitude: number
}): CommonRes<API.LocationRes> {
  return request({
    url: 'https://api.abcdtools.com/location-to-city',
    method: 'POST',
    data,
  })
}
