import { AxiosResponse } from 'axios'

type CommonRes<T> = Promise<AxiosResponse<T>['data']>

declare namespace API {
  interface Location {
    show_name: string
    show_namezh: string
    show_nameen: string
  }

  interface LocationRes {
    status: string
    data: Location
  }

  /**
   * Request
   */
  interface TesRequest {
    data: Data
    errmsg: string
    errno: number
    [property: string]: unknown
  }

  type InfoRes = CommonRes<TesRequest>

  interface Data {
    banner: Banner[]
    cartCount: number
    categoryList: CategoryList[]
    channel: Channel[]
    notices: Notice[]
    [property: string]: unknown
  }

  interface Banner {
    goods_id: number
    image_url: string
    link: string
    link_type: number
    [property: string]: unknown
  }

  interface CategoryList {
    banner?: string
    goodsList?: GoodsList[]
    height?: number
    id?: number
    name?: string
    [property: string]: unknown
  }

  interface GoodsList {
    goods_number: number
    id: number
    is_new: number
    list_pic_url: string
    min_retail_price: number
    name: string
    [property: string]: unknown
  }

  interface Channel {
    icon_url?: string
    id?: number
    name?: string
    sort_order?: number
    [property: string]: unknown
  }

  interface Notice {
    content?: string
    [property: string]: unknown
  }

  interface WeatherResponse {
    count: string
    forecasts: Forecast[]
    info: string
    infocode: string
    lives: Life[]
    status: string
    [property: string]: unknown
  }

  type WeatherRes = CommonRes<WeatherResponse>

  interface Forecast {
    adcode?: string
    casts?: Cast[]
    city?: string
    province?: string
    reporttime?: string
    [property: string]: unknown
  }

  interface Cast {
    date: string
    daytemp_float: string
    nighttemp_float: string
    daypower: string
    daytemp: string
    dayweather: string
    daywind: string
    nightpower: string
    nighttemp: string
    nightweather: string
    nightwind: string
    week: string
    [property: string]: unknown
  }

  interface Life {
    adcode?: string
    city?: string
    humidity?: string
    humidity_float?: string
    province?: string
    reporttime?: string
    temperature?: string
    temperature_float?: string
    weather?: string
    winddirection?: string
    windpower?: string
    [property: string]: unknown
  }

  interface MeteoParams {
    latitude?: number
    longitude?: number
    hourly?: string
    models?: string
    [key: string]: unknown
  }

  interface MeteoData {
    date: string
    temperature2m: string
  }

  interface MinMax {
    max: number
    min: number
    date: string
  }

  namespace Meteo {
    interface Response {
      elevation: number
      generationtime_ms: number
      hourly: Hourly
      hourly_units: HourlyUnits
      latitude: number
      longitude: number
      timezone: string
      timezone_abbreviation: string
      utc_offset_seconds: number

      [property: string]: unknown
    }

    type MeteoRes = CommonRes<Response>

    interface Hourly {
      temperature_2m: Array<number | null>
      time: number[]

      [property: string]: unknown
    }

    interface HourlyUnits {
      temperature_2m: string
      time: string

      [property: string]: unknown
    }
  }
}
