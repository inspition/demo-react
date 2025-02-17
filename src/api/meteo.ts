import { fetchWeatherApi } from 'openmeteo'
import request from '@/utils/request'
import { API } from '@/types/api'

const URL = 'https://api.open-meteo.com/v1/forecast'

/**
 * open-meteo API 官方示例
 *
 * @export
 * @async
 * @returns {unknown}
 */
export async function fetchWeather(
  params: API.MeteoParams = {
    latitude: 52.52,
    longitude: 13.41,
    hourly: 'temperature_2m',
    models: 'cma_grapes_global',
  }
) {
  // const params = {
  //   latitude: 52.52,
  //   longitude: 13.41,
  //   hourly: 'temperature_2m',
  //   models: 'cma_grapes_global',
  // }

  const responses = await fetchWeatherApi(URL, params)

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
  const data: API.MeteoData[] = time.map((t, i) => ({
    date: t.toLocaleString(),
    temperature2m: temperature2m[i].toFixed(1),
  }))

  return {
    data,
    latitude,
    longitude,
  }
}

/**
 * open-meteo API 封装
 *
 * @export
 * @param {API.MeteoParams} [params]
 * @returns {*}
 */
export function apiOpemMeteo(params?: API.MeteoParams) {
  return request({
    url: URL,
    method: 'GET',
    params,
  })
}
