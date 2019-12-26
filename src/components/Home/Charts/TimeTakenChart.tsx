import React from 'react'
import { Bar, YAxis } from 'recharts'
import { Chart, ChartWrapper } from '../../common'

const info = 'This distribution gives users an idea of how long a given executive takes to pass. '
const links = [
  { title: 'MKR Registry', uri: 'asdasd' },
  { title: 'MakerDao Governance', uri: 'asdasd' },
]

const TimeTakenChart = props => {
  const { wrapperProps, modalProps } = props

  return (
    <ChartWrapper info={info} links={links} {...wrapperProps} hideFilters>
      <Chart {...modalProps}>
        <YAxis />
        <Bar
          isAnimationActive={modalProps.data ? false : true}
          name={'Executive Vote Count'}
          dataKey="count"
          fill="#61b6b0"
        />
      </Chart>
    </ChartWrapper>
  )
}

export default TimeTakenChart
