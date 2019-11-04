import React from 'react'
import { Bar, YAxis } from 'recharts'
import { Chart, ChartWrapper } from '../../common'

const customStyles = {
  padding: 0,
  position: 'relative',
  bottom: '6px',
  paddingBottom: '5px',
}

const ApprovalsByAddressChart = props => {
  const { wrapperProps, modalProps } = props
  return (
    <ChartWrapper styles={customStyles} {...wrapperProps} hideFilters>
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
