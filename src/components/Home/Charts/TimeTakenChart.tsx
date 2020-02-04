import React from 'react'
import { Bar, YAxis } from 'recharts'
import { Chart, ChartWrapper } from '../../common'

const info = `This tile shows the average amount of time that passes between an executives proposals creation and its execution. This can be used to estimate the time it will take for a non-controversial executive to pass, and also used as a metric to determine how aligned MKR Token Holders are. <br><br> Each executive proposal is collected by tracking events emitted by DSChief and calculating the number of blocks between the creation block of each executive proposal, and the ‘cast’ block of each executive spell. This block difference is then converted into standard time and each executive is dropped into the appropriate bucket. The count of executive proposals in each bucket is then displayed. <br><br> <strong>Note that this tile does not track executives that have never been cast, or executives that were cast more than 30 days after their creation.</strong>`
const links = [
  {
    title: 'MakerDAO Governance Graph',
    uri: 'https://thegraph.com/explorer/subgraph/protofire/makerdao-governance?query=Executive%20votes',
  },
]

const TimeTakenChart = props => {
  const { wrapperProps, modalProps } = props

  return (
    <ChartWrapper markdown info={info} links={links} {...wrapperProps} hideFilters>
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
