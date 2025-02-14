import React, { useEffect } from 'react'
import { Breadcrumb, Layout, Menu, MenuProps, theme } from 'antd'
import { Link, Outlet, useLocation } from 'react-router'
import { routes } from '@/routes'

const { Header, Content, Sider } = Layout

const items1: MenuProps['items'] = routes.map(v => ({
  key: v.path ?? '',
  label: <Link to={v.path ?? ''}>{v.meta?.title ?? ''}</Link>,
}))

const LayoutComp: React.FC = () => {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken()

  const { pathname } = useLocation()
  const curRoute = routes.find(v => v.path === pathname)
  useEffect(() => {
    if (curRoute?.meta?.title) document.title = curRoute.meta.title
  }, [pathname, curRoute])

  return (
    <Layout>
      <Header style={{ display: 'flex', alignItems: 'center' }}>
        <div className="demo-logo" />
        <Menu
          theme="dark"
          mode="horizontal"
          defaultSelectedKeys={['2']}
          items={items1}
          style={{ flex: 1, minWidth: 0 }}
        />
      </Header>

      <Layout>
        <Sider width={200} style={{ background: colorBgContainer }}>
          <Menu
            mode="inline"
            defaultSelectedKeys={['2']}
            items={items1}
            style={{ height: '100%', borderRight: 0 }}
          />
        </Sider>

        <Layout style={{ padding: '0 24px 24px' }}>
          <Breadcrumb
            items={[{ title: 'Home' }, { title: 'List' }, { title: 'App' }]}
            style={{ margin: '16px 0' }}
          />
          <Content
            style={{
              padding: 24,
              margin: 0,
              minHeight: 280,
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
            }}
          >
            <Outlet />
          </Content>
        </Layout>
      </Layout>
    </Layout>
  )
}

export default LayoutComp
