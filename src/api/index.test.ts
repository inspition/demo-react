import { describe, it, expect } from 'vitest'
import { fetchWeather } from './meteo'

describe('API 联通测试', () => {
  it('should return a successful response', async () => {
    const response = await fetchWeather()

    expect(response.data).toBeInstanceOf(Array)
    // expect(2 + 3 * 4).toBe(14)
  })
})
