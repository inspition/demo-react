import request from '@/utils/request'

// const baseURL = 'api/'

/**
 * Request
 */
export interface Request {
  data: Data;
  errmsg: string;
  errno: number;
  [property: string]: unknown;
}

export interface Data {
  banner: Banner[];
  cartCount: number;
  categoryList: CategoryList[];
  channel: Channel[];
  notices: Notice[];
  [property: string]: unknown;
}

export interface Banner {
  goods_id: number;
  image_url: string;
  link: string;
  link_type: number;
  [property: string]: unknown;
}

export interface CategoryList {
  banner?: string;
  goodsList?: GoodsList[];
  height?: number;
  id?: number;
  name?: string;
  [property: string]: unknown;
}

export interface GoodsList {
  goods_number: number;
  id: number;
  is_new: number;
  list_pic_url: string;
  min_retail_price: number;
  name: string;
  [property: string]: unknown;
}

export interface Channel {
  icon_url?: string;
  id?: number;
  name?: string;
  sort_order?: number;
  [property: string]: unknown;
}

export interface Notice {
  content?: string;
  [property: string]: unknown;
}


export function IndexData() {
  return request<Data>({
    // baseURL,
    url: 'weixin/index/appInfo',
    method: 'get',
  })
}