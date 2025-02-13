import { Data, IndexData } from '@/api'
import { Button, DatePicker, Input } from 'antd'
import { useState } from 'react'

export default function ChardtsDemo() {
  const [content, setContent] = useState<Data>()

  async function handleClick() {
    const { data } = await IndexData()
    // setContent(JSON.stringify(data))
    setContent(data)
    // console.log(data)
  }

  return (
    <>
      <h1>ChartsDemo</h1>

      <DatePicker />

      <Input />

      <Button onClick={handleClick}>请求演示</Button>

      {content?.categoryList.map(v =>
        v.goodsList?.map(g => <div>{`${g.name} - ${g.list_pic_url}`}</div>)
      )}
    </>
  )
}
