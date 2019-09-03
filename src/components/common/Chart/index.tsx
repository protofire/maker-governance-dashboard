import React from 'react'
import { ComposedChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

type Props = {
  data: Array<any>
  width: Number
  height: Number
}

function Chart(props: Props) {
  const { data, width, height } = props //500 400

  return (
    <>
      <ResponsiveContainer>
        <ComposedChart width={width} height={height} data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis />
          <YAxis />
          <Tooltip />
          <Legend verticalAlign="bottom" />
          <Line name="Number of voters - Current 1000" stroke="red" strokeWidth={2} type="monotone" dataKey="pv" />
          <Line name="Total MKR stacked - Current 2000" stroke="blue" strokeWidth={2} type="monotone" dataKey="uv" />
        </ComposedChart>
      </ResponsiveContainer>
    </>
  )
}

export default Chart
