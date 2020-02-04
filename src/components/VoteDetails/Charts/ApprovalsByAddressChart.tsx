import React from 'react'
import { Bar, YAxis } from 'recharts'
import { Chart, ChartWrapper } from '../../common'

const info = `This tile shows how different ‘sizes’ of MKR holding wallet were represented in this executive proposal. This allows governance to see how opinions differ between MKR holders of different sizes. <br><br> This metric is generated using the Lock and Free events emitted by the DSChief governance contract which relate to this executive proposal. For each Lock event the amount of MKR locked by this address is counted. Based on this count, the vote is placed in one of the buckets displayed on the tile. For each Free event the vote is either removed or moved to a different bucket based on the new amount of MKR locked. The count of addresses in each bucket is then displayed.<br><br> <strong>Note that this metric is not sybil safe.</strong>`
const links = [
  {
    title: 'MakerDAO Governance Graph',
    uri: 'https://thegraph.com/explorer/subgraph/protofire/makerdao-governance?query=Executive%20vote',
  },
]

const ApprovalsByAddressChart = props => {
  const { wrapperProps, modalProps } = props
  return (
    <ChartWrapper info={info} markdown links={links} {...wrapperProps} hideFilters>
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
