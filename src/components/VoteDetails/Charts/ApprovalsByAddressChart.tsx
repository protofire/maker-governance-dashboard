import React from 'react'
import { Bar, YAxis } from 'recharts'
import { Chart, ChartWrapper } from '../../common'

const ApprovalsByAddressChart = props => {
  const { wrapperProps, modalProps, currentMkr } = props
  return (
    <ChartWrapper {...wrapperProps} hideFilters>
      <Chart {...modalProps}>
        <YAxis />
        <Bar
          isAnimationActive={modalProps.data ? false : true}
          name={`Approvals by address - Current: ${currentMkr}`}
          fill="#a04827"
          dataKey="mkr"
        />
      </Chart>
    </ChartWrapper>
  )
}

export default ApprovalsByAddressChart
