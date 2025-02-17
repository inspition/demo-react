import { AxiosResponse } from 'axios'

declare namespace API {
  type CommonRes<T> = Promise<AxiosResponse<T>['data']>

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
    daypower: string
    daytemp: string
    daytemp_float: string
    dayweather: string
    daywind: string
    nightpower: string
    nighttemp: string
    nighttemp_float: string
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
}
