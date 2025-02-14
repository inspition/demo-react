import { indexData, weatherforecast } from '@/api'
import { API } from '@/types/api'
import { Button } from 'antd'
import { useState } from 'react'

export default function ChardtsDemo() {
  const [content, setContent] = useState<API.Data>()

  async function handleClick() {
    const { data } = await indexData()
    // setContent(JSON.stringify(data))
    setContent(data)
    // console.log(import.meta.env)
  }

  async function searchWeather() {
    const data = await weatherforecast({ city: '350200' })

    console.log(data)
  }

  return (
    <>
      <Button onClick={handleClick} type="primary">
        请求演示
      </Button>

      <Button onClick={searchWeather} type="primary">
        天气查询
      </Button>

      {content?.categoryList.map(v =>
        v.goodsList?.map(g => (
          <div key={g.id}>{`${g.name} - ${g.list_pic_url}`}</div>
        ))
      )}
    </>
  )
}
