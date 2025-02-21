import { HTMLAttributes, memo, useEffect, useRef, useState } from 'react'
import {
  Cartesian3,
  Cartographic,
  Color,
  defined,
  Math,
  SceneMode,
  ScreenSpaceEventHandler,
  ScreenSpaceEventType,
  Viewer,
} from 'cesium'
import Styles from './cesium.module.scss'
import { mapLayers } from './map-layers'

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

        sceneMode: SceneMode.SCENE2D,
      })

      return () => {
        viewer?.destroy()
        handlerRef.current?.destroy()
      }
    }, [])

    async function init(...args: ConstructorParameters<typeof Viewer>) {
      viewer?.destroy()

      const _viewer = new Viewer(...args)
      setViewer(_viewer)
      window.viewer = _viewer

      // mountGoogleMap(_viewer)
      mountMapLayers(_viewer)
      mountHandler(_viewer)

      cameraFocus(await getUserGeolocation(), _viewer)

      console.log('init', onUpdate?.(viewer))
    }

    /**
     * 获取用户坐标
     *
     * @async
     * @returns {unknown}
     */
    async function getUserGeolocation() {
      const res = (await new Promise((resolve, reject) => {
        navigator.geolocation?.getCurrentPosition?.(resolve, reject)
      }).catch(err => err)) as unknown as GeolocationPosition

      const { latitude, longitude } = res?.coords ?? {}

      return res?.coords ? { latitude, longitude, height: 5000 } : undefined
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

    /**
     * 加载地图图层
     *
     * @param {Viewer} _viewer
     */
    function mountMapLayers(_viewer: Viewer) {
      mapLayers().forEach(layer => {
        _viewer.imageryLayers.addImageryProvider(...layer)
      })
    }

    /**
     * 画面聚焦（默认经纬度：厦门）
     *
     * @param {{ longitude: number; latitude: number; height: number; }} [destination={ longitude: 118, latitude: 24, height: 5000 }]
     * @param {*} [_viewer=viewer]
     */
    function cameraFocus(
      destination = {
        longitude: 118.12181772772028,
        latitude: 24.492788845905654,
        height: 5000,
      },
      _viewer = viewer
    ) {
      const { longitude, latitude, height } = destination ?? {}
      _viewer?.camera.flyTo({
        destination: Cartesian3.fromDegrees(longitude, latitude, height),
        duration: 2,
      })
    }

    // 挂载事件处理
    function mountHandler(_viewer: Viewer) {
      const handler = new ScreenSpaceEventHandler(_viewer.scene.canvas)

      handler.setInputAction((ev: HandlerEvent) => {
        // console.log('inputAction:', ev)

        const pickedFeature = _viewer.scene.pick(ev.position)

        if (defined(pickedFeature) && pickedFeature?.id) {
          // 已有实体进行删除
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

    // console.log(Styles)

    return (
      <div id="cesium-container" className={Styles['cesium-wrap']} {...props} />
    )
  }
)
