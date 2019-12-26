import React from 'react'
import { Bar, YAxis } from 'recharts'
import { Chart, ChartWrapper } from '../../common'

const info =
  'Gives users an idea of how well represented different ‘sizes’ of MKR holder were in this vote. Note that this metric is not sybil safe. '
const links = [
  { title: 'MKR Registry', uri: 'asdasd' },
  { title: 'MakerDao Governance', uri: 'asdasd' },
]

const ApprovalsByAddressChart = props => {
  const { wrapperProps, modalProps } = props
  return (
    <ChartWrapper info={info} links={links} {...wrapperProps} hideFilters>
      <Chart {...modalProps}>
        <YAxis />
        <Bar
          isAnimationActive={modalProps.data ? false : true}
          name={'Approvals by Address Size'}
          fill="#a04827"
          dataKey="count"
        />
      </Chart>
    </ChartWrapper>
  )
}

export default ApprovalsByAddressChart
