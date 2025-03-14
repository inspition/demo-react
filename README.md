# 天气数据可视化与地图交互应用

#### 演示地址

> [Vite + React + TS](https://inspition.github.io/demo-react/) **cesium地图采用内置卫星地图：BingMaps，如未启用科学上网将无法正常渲染。**

## 快速上手

安装依赖`pnpm i`,启动项目`pnpm run dev`

## 项目概况

本系统是基于React技术栈构建的技术验证平台，采用模块化架构设计实现GIS数据交互与多维可视化能力。作为全链路技术验证项目。

## 开发背景

作为具有跨框架开发经验的前端工程师，本项目旨在完成三个维度的技术验证：

1. **框架能力对比**：基于Vue工程化实践积累（Vue2/3 + TSX），系统性验证React技术栈在复杂数据可视化场景下的架构模式差异。

2. **技术方案迁移**：将Vue生态中的状态管理、组件封装等最佳实践转化为React实现方案，建立多框架技术储备。

3. **性能基准测试**：对比Cesium在React环境下与Vue的渲染性能差异，为GIS技术选型提供参考样本。

## 技术选型

| 类别     | 技术方案                         |
| ------ | ---------------------------- |
| 核心框架   | React 19 + TypeScript + Antd |
| 可视化引擎  | AntV G2 5.0                  |
| 地理空间服务 | Cesium                       |
| 工程化体系  | Vite + pnpm                  |
| 数据服务   | Open-Meteo API + 高德天气API     |

## 功能点

- GIS数据交互：点击地图区域获取对应地区天气数据。

- 数据可视化：使用 AntV G2 展示温度、湿度等指标。
