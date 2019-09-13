import React from 'react'
import { ComposedChart, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

type Props = {
  data: Array<any>
  children: React.ReactNode
  width: Number
  height: Number
  modalStyles?: Object
}

function Chart(props: Props) {
  const { data, width, height, children, modalStyles } = props

  return (
    <>
      <ResponsiveContainer {...modalStyles}>
        <ComposedChart width={width} height={height} data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis />
          <YAxis />
          <Tooltip />
          <Legend verticalAlign="bottom" />
          {children}
        </ComposedChart>
      </ResponsiveContainer>
    </>
  )
}

export default Chart
