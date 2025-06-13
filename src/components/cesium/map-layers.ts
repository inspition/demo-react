import {
  ImageryLayerCollection,
  UrlTemplateImageryProvider,
  WebMapTileServiceImageryProvider,
  WebMercatorTilingScheme,
} from 'cesium'
import { TMAP_TK } from '@/config/index.json'

type LayerParams = Parameters<ImageryLayerCollection['addImageryProvider']>

/**
 * 地图图层集中整合
 *
 * @returns {[ImageryProvider, number?][]}
 */
export const mapLayers: () => LayerParams[] = () => [
  // 谷歌地图
  [
    new UrlTemplateImageryProvider({
      url: 'https://www.google.com/maps/vt?lyrs=s@800&x={x}&y={y}&z={z}',
      tilingScheme: new WebMercatorTilingScheme(),
      minimumLevel: 1,
      maximumLevel: 30,
    }),
  ],

  // // 影像底图
  // [
  //   new WebMapTileServiceImageryProvider({
  //     url:
  //       'http://t0.tianditu.com/img_w/wmts?service=wmts&request=GetTile&version=1.0.0&LAYER=img&tileMatrixSet=w&TileMatrix={TileMatrix}&TileRow={TileRow}&TileCol={TileCol}&style=default&format=tiles&tk=' +
  //       TMAP_TK,
  //     layer: 'tdtBasicLayer',
  //     style: 'default',
  //     format: 'image/jpeg',
  //     tileMatrixSetID: 'GoogleMapsCompatible',
  //     // show: false,
  //   }),
  // ],

  // // 矢量底图
  // [
  //   new WebMapTileServiceImageryProvider({
  //     url:
  //       'http://t0.tianditu.com/vec_w/wmts?service=wmts&request=GetTile&version=1.0.0&LAYER=vec&tileMatrixSet=w&TileMatrix={TileMatrix}&TileRow={TileRow}&TileCol={TileCol}&style=default&format=tiles&tk=' +
  //       TMAP_TK,
  //     layer: 'tdtVecBasicLayer',
  //     style: 'default',
  //     format: 'image/jpeg',
  //     tileMatrixSetID: 'GoogleMapsCompatible',
  //     // show: false,
  //   }),
  // ],

  // 矢量注记
  [
    new WebMapTileServiceImageryProvider({
      url:
        'http://t0.tianditu.com/cva_w/wmts?service=wmts&request=GetTile&version=1.0.0&LAYER=cva&tileMatrixSet=w&TileMatrix={TileMatrix}&TileRow={TileRow}&TileCol={TileCol}&style=default.jpg&tk=' +
        TMAP_TK,
      layer: 'tdtAnnoLayer',
      style: 'default',
      format: 'image/jpeg',
      tileMatrixSetID: 'GoogleMapsCompatible',
    }),
  ],

  // 影像注记
  [
    new WebMapTileServiceImageryProvider({
      url:
        'http://t0.tianditu.com/cia_w/wmts?service=wmts&request=GetTile&version=1.0.0&LAYER=cia&tileMatrixSet=w&TileMatrix={TileMatrix}&TileRow={TileRow}&TileCol={TileCol}&style=default.jpg&tk=' +
        TMAP_TK,
      layer: 'tdtAnnoLayer',
      style: 'default',
      format: 'image/jpeg',
      tileMatrixSetID: 'GoogleMapsCompatible',
      // show: false,
    }),
  ],

  // // 高德地图
  // [
  //   new UrlTemplateImageryProvider({
  //     url: 'https://webst02.is.autonavi.com/appmaptile?x={x}&y={y}&z={z}&style=6',
  //     // url: 'http://webst02.is.autonavi.com/appmaptile?x={x}&y={y}&z={z}&lang=zh_cn&size=1&scale=1&style=8',
  //     // minimumLevel: 3,
  //     // maximumLevel: 30,
  //   }),
  // ],

  // // 高德路网
  // [
  //   new UrlTemplateImageryProvider({
  //     url: 'http://webst02.is.autonavi.com/appmaptile?x={x}&y={y}&z={z}&lang=zh_cn&size=1&scale=1&style=8',
  //     minimumLevel: 3,
  //     maximumLevel: 30,
  //   }),
  // ],
]
