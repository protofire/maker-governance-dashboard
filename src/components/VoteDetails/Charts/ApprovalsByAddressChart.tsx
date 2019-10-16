import React from 'react'
import { Bar, YAxis } from 'recharts'
import { Chart, ChartWrapper } from '../../common'

const ApprovalsByAddressChart = props => {
  const { wrapperProps, modalProps, currentVoters } = props
  return (
    <ChartWrapper {...wrapperProps} hideFilters>
      <Chart {...modalProps}>
        <YAxis />
        <Bar
          isAnimationActive={modalProps.data ? false : true}
          name={`Approvals by address - Current: ${currentVoters}`}
          fill="#a04827"
          dataKey="count"
        />
      </Chart>
    </ChartWrapper>
  )
}

export default ApprovalsByAddressChart
