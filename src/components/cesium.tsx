import { HTMLAttributes, memo, useEffect, useRef, useState } from 'react'
import {
  Cartesian3,
  Cartographic,
  Color,
  defined,
  Math,
  ScreenSpaceEventHandler,
  ScreenSpaceEventType,
  // UrlTemplateImageryProvider,
  // WebMercatorTilingScheme,
  Viewer,
  WebMapTileServiceImageryProvider,
} from 'cesium'
import { TMAP_TK } from '@/config/index.json'

type HandlerEvent = ScreenSpaceEventHandler.PositionedEvent & {
  [k in string]: unknown
}

interface CesiumWrapProps {
  onAdded?: (entity: AddedEntity) => void
  onDelete?: (...args: unknown[]) => void
  onUpdate?: (...args: unknown[]) => void
}

export interface AddedEntity {
  id: string
  longitude: number
  latitude: number
}

export const CesiumWrap = memo(
  ({
    onUpdate,
    onAdded,
    onDelete,
    ...props
  }: CesiumWrapProps & HTMLAttributes<HTMLDivElement>) => {
    // const container = useRef<HTMLDivElement>(null)
    const [viewer, setViewer] = useState<Viewer>()
    const handlerRef = useRef<ScreenSpaceEventHandler>(null)

    useEffect(() => {
      // if (container.current) init(container.current)
      init('cesium-container', {
        animation: false, // 隐藏动画控件
        timeline: false, // 隐藏时间线控件
        infoBox: false, // 隐藏信息框
        fullscreenButton: false,
        homeButton: false, // 隐藏 home 按钮
        navigationHelpButton: false, // 隐藏导航帮助按钮
        navigationInstructionsInitiallyVisible: false, // 隐藏导航说明
        vrButton: false, // 隐藏 VR 按钮
        geocoder: false, // 隐藏地理编码控件
        // globe: false,
        // selectionIndicator: false, // 隐藏选择指示器
        // sceneModePicker: false,
        // watermark: false, // 隐藏水印

        // sceneMode: SceneMode.SCENE2D,
      })

      return () => {
        viewer?.destroy()
        handlerRef.current?.destroy()
      }
    }, [])

    function init(...args: ConstructorParameters<typeof Viewer>) {
      viewer?.destroy()

      const _viewer = new Viewer(...args)
      // mountGoogleMap(_viewer)
      mountTianditu(_viewer) // 加载天地图底图
      mountHandler(_viewer)

      setViewer(_viewer)
      window.viewer = _viewer

      console.log('init', onUpdate?.(viewer))
    }

    // function mountGoogleMap(_viewer: Viewer) {
    //   const googleImagerProvider = new UrlTemplateImageryProvider({
    //     url: 'https://www.google.com/maps/vt?lyrs=s@800&x={x}&y={y}&z={z}',
    //     tilingScheme: new WebMercatorTilingScheme(),
    //     minimumLevel: 1,
    //     maximumLevel: 30,
    //   })
    //   _viewer.imageryLayers.addImageryProvider(googleImagerProvider)
    // }

    function mountTianditu(_viewer: Viewer) {
      // const imageryProviderT = new UrlTemplateImageryProvider({
      //   url:
      //     'http://{s}.tianditu.com/DataServer?T=vec_w&X={x}&Y={y}&L={z}&tk=' +
      //     TMAP_TK,
      //   subdomains: ['t0', 't1', 't2', 't3', 't4', 't5', 't6', 't7'],
      //   maximumLevel: 18,
      //   minimumLevel: 1,
      //   credit: 'Tianditu',
      // })

      // 矢量底图
      // _viewer.imageryLayers.addImageryProvider(
      //   new WebMapTileServiceImageryProvider({
      //     url:
      //       'http://t0.tianditu.com/vec_w/wmts?service=wmts&request=GetTile&version=1.0.0&LAYER=vec&tileMatrixSet=w&TileMatrix={TileMatrix}&TileRow={TileRow}&TileCol={TileCol}&style=default&format=tiles&tk=' +
      //       TMAP_TK,
      //     layer: 'tdtVecBasicLayer',
      //     style: 'default',
      //     format: 'image/jpeg',
      //     tileMatrixSetID: 'GoogleMapsCompatible',
      //     // show: false,
      //   })
      // )

      // 矢量注记
      _viewer.imageryLayers.addImageryProvider(
        new WebMapTileServiceImageryProvider({
          url:
            'http://t0.tianditu.com/cva_w/wmts?service=wmts&request=GetTile&version=1.0.0&LAYER=cva&tileMatrixSet=w&TileMatrix={TileMatrix}&TileRow={TileRow}&TileCol={TileCol}&style=default.jpg&tk=' +
            TMAP_TK,
          layer: 'tdtAnnoLayer',
          style: 'default',
          format: 'image/jpeg',
          tileMatrixSetID: 'GoogleMapsCompatible',
        })
      )

      // 影像底图
      // _viewer.imageryLayers.addImageryProvider(
      //   new WebMapTileServiceImageryProvider({
      //     url:
      //       'http://t0.tianditu.com/img_w/wmts?service=wmts&request=GetTile&version=1.0.0&LAYER=img&tileMatrixSet=w&TileMatrix={TileMatrix}&TileRow={TileRow}&TileCol={TileCol}&style=default&format=tiles&tk=' +
      //       TMAP_TK,
      //     layer: 'tdtBasicLayer',
      //     style: 'default',
      //     format: 'image/jpeg',
      //     tileMatrixSetID: 'GoogleMapsCompatible',
      //     // show: false,
      //   })
      // )

      // 影像注记
      _viewer.imageryLayers.addImageryProvider(
        new WebMapTileServiceImageryProvider({
          url:
            'http://t0.tianditu.com/cia_w/wmts?service=wmts&request=GetTile&version=1.0.0&LAYER=cia&tileMatrixSet=w&TileMatrix={TileMatrix}&TileRow={TileRow}&TileCol={TileCol}&style=default.jpg&tk=' +
            TMAP_TK,
          layer: 'tdtAnnoLayer',
          style: 'default',
          format: 'image/jpeg',
          tileMatrixSetID: 'GoogleMapsCompatible',
          // show: false,
        })
      )

      // 高德路网
      // const imageryProviderAM = new UrlTemplateImageryProvider({
      //   url: 'http://webst02.is.autonavi.com/appmaptile?x={x}&y={y}&z={z}&lang=zh_cn&size=1&scale=1&style=8',
      //   minimumLevel: 3,
      //   maximumLevel: 30,
      // })
      // _viewer.imageryLayers.addImageryProvider(imageryProviderAM) //加载矢量底图
    }

    // 挂载事件处理
    function mountHandler(_viewer: Viewer) {
      const handler = new ScreenSpaceEventHandler(_viewer.scene.canvas)

      handler.setInputAction((ev: HandlerEvent) => {
        // console.log('inputAction:', ev)

        const pickedFeature = _viewer.scene.pick(ev.position)

        if (defined(pickedFeature) && pickedFeature?.id) {
          // 已有实体进行删除
          // viewer?.entities.remove(pickedFeature.id)
          deleteEntity(pickedFeature?.id?.id ?? pickedFeature?.id, _viewer)
        } else {
          // 点击空白处添加标注
          addEntity(ev, _viewer)
        }
      }, ScreenSpaceEventType.LEFT_CLICK)

      handlerRef.current = handler
    }

    // 移除标注
    function deleteEntity(id: string, _viewer: Viewer) {
      if (_viewer?.entities.removeById(id)) onDelete?.(id)
    }

    // 添加标注
    function addEntity(ev: HandlerEvent, _viewer: Viewer) {
      const pickedPosition = _viewer.scene.pickPosition(ev?.position)
      const cartographic = Cartographic.fromCartesian(pickedPosition)
      const longitude = Math.toDegrees(cartographic.longitude)
      const latitude = Math.toDegrees(cartographic.latitude)

      _viewer.entities.removeAll()

      // 添加标注
      const { id } = _viewer.entities.add({
        position: Cartesian3.fromDegrees(longitude, latitude),
        point: {
          pixelSize: 10,
          color: Color.RED,
        },
      })

      const entity = { longitude, latitude, id }
      console.log('postion: ', entity)
      onAdded?.(entity)
    }

    return <div id="cesium-container" {...props} />
  }
)
