import React from 'react'
import { Bar, YAxis } from 'recharts'
import { Chart, ChartWrapper } from '../../common'

const info =
  'The more responsive MKR tokens are, the safer the system is. It gives a good ballpark estimate for how much MKR we can expect to see voting in polls and how quickly that MKR will vote.'
const links = [
  { title: 'MKR Registry', uri: 'asdasd' },
  { title: 'MakerDao Governance', uri: 'asdasd' },
]

const PollsResponsivenessChart = props => {
  const { wrapperProps, modalProps } = props

  return (
    <ChartWrapper info={info} links={links} {...wrapperProps} hideFilters>
      <Chart {...modalProps}>
        <YAxis type="number" domain={[0, 'dataMax']} />
        <Bar
          isAnimationActive={modalProps.data ? false : true}
          name={'MKR Responsiveness'}
          dataKey="mkr"
          fill="#a04827"
        />
      </Chart>
    </ChartWrapper>
  )
}

export default PollsResponsivenessChart
