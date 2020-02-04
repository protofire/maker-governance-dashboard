import React from 'react'
import { Bar, Cell, YAxis } from 'recharts'
import { Chart, ChartWrapper } from '../../common'
import { CustomSvg } from '../../common/Icon'

const info = `This tile shows the distribution of staked MKR over executive proposals ordered by date. This informs governance as to the distribution of MKR within DSChief and denotes clearly which executive currently has the ‘hat.’ <br><br> This metric is generated using the Lock and Free events emitted by the DSChief contract. For each executive proposal the Freed MKR is summed and subtracted from the summed Locked MKR to get the current amount of MKR staked on each executive proposal. This total value is then displayed on the graph as a bar ordered by the executive creation date. Finally the ‘hat’ executive is coloured dark grey to separate it from the other executives.`
const links = [
  {
    title: 'MakerDAO Governance Graph - Executives',
    uri: 'https://thegraph.com/explorer/subgraph/protofire/makerdao-governance?query=Executive%20votes',
  },
  {
    title: 'MakerDAO Governance Graph - Governance Info',
    uri: 'https://thegraph.com/explorer/subgraph/protofire/makerdao-governance?query=Governance%20Info',
  },
]

const renderLegend = props => {
  const { payload } = props
  return (
    <ul style={{ listStyleType: 'none' }}>
      {payload.map((entry, index) => (
        <li key={`item-${index}`}>
          <CustomSvg color="#a04827" />
          <span>{entry.value}</span>
        </li>
      ))}
      <li key="item-hat">
        <CustomSvg color="#000000" />
        <span>Current Hat</span>
      </li>
    </ul>
  )
}

const MkrDistributionPerExecutiveChart = props => {
  const { wrapperProps, modalProps } = props
  const maxValue = Math.max(...modalProps.data.map(o => o.mkr), 0)
  return (
    <ChartWrapper markdown info={info} links={links} {...wrapperProps} hideFilters>
      <Chart {...modalProps} showXaxis={3} legend={renderLegend}>
        <YAxis style={{ fontSize: '12px' }} type="number" domain={[0, maxValue]} />
        <Bar isAnimationActive={modalProps.data ? false : true} name={'Executive vote'} dataKey="mkr">
          {modalProps.data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.isHat ? '#000000' : '#a04827'} />
          ))}
        </Bar>
      </Chart>
    </ChartWrapper>
  )
}

export default MkrDistributionPerExecutiveChart
