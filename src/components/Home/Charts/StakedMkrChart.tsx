import React, { useState } from 'react'
import { Line, YAxis } from 'recharts'

import { Chart, ChartWrapper, LegendLi } from '../../common'
import { CustomSvg } from '../../common/Icon'

const info = `This tile shows MKR participation in voting over time. This allows governance to judge the current and historic safety of the system and the representativeness of the current set of system parameters. <br><br> Total MKR is calculated by summing all mint and burn events for the MKR token and displaying the summed value at each date on the graph. <br><br> Staked MKR is calculated by summing the MKR locked in the DSChief governance contract (denoted by the emitted Lock event) and subtracting the MKR unlocked from the DSChief governance contract (denoted by the emitted Free event). <br><br> Voting MKR is calculated by looping over each Vote event and summing the MKR if it is a positive vote, and subtracting it if it is a vote for ‘no proposal’. MKR removed from the Chief (denoted by Free events) is deducted from this total.<br><br> Non-Voting MKR is calculated by subtracting the value for Voting MKR from the value for Staked MKR.`
const links = [
  {
    title: 'MakerDAO Governance Graph',
    uri:
      'https://thegraph.com/explorer/subgraph/protofire/makerdao-governance?query=Lock%2C%20Free%20and%20Vote%20Actions',
  },
  {
    title: 'MKR Registry Graph',
    uri: 'https://thegraph.com/explorer/subgraph/protofire/mkr-registry?query=Burn%20and%20Mint%20Events',
  },
]

const StakedMkrChart = ({ wrapperProps, modalProps }) => {
  const [selectedLines, setSelectedLine] = useState<any>(['totalSupply'])
  const [opacities, setOpacities] = useState({})
  const getOpacities = opacities => setOpacities(opacities)
  const selectLine = e => {
    let selected = selectedLines.includes(e.payload.originalKey)
      ? selectedLines.filter(line => line !== e.payload.originalKey)
      : [...selectedLines, e.payload.originalKey.trim()]
    setSelectedLine(selected)
  }
  const renderLegend = props => {
    const { payload, onMouseEnter, onMouseLeave, onClick } = props
    return (
      <ul className="recharts-default-legend" style={{ listStyleType: 'none' }}>
        {payload.map((entry, index) => (
          <LegendLi
            onMouseEnter={() => onMouseEnter(entry)}
            onMouseLeave={() => onMouseLeave(entry)}
            onClick={() => onClick(entry)}
            disabledValue={selectedLines.includes(entry.payload.originalKey)}
            className={`recharts-legend-item legend-item-${index}`}
            key={`item-${index}`}
          >
            <CustomSvg color={entry.color} />
            <span>{entry.value}</span>
          </LegendLi>
        ))}
      </ul>
    )
  }

  return (
    <ChartWrapper markdown info={info} links={links} {...wrapperProps}>
      <Chart legend={renderLegend} getOpacity={getOpacities} handleLegend={selectLine} {...modalProps}>
        <YAxis type="number" domain={[0, 'dataMax']} />
        <Line
          strokeOpacity={opacities['totalSupply']}
          name="Total MKR Supply"
          originalKey="totalSupply"
          dataKey={selectedLines.length === 0 || !selectedLines.includes('totalSupply') ? 'totalSupply' : ''}
          dot={false}
          isAnimationActive={!modalProps.data}
          stroke="#387908"
          strokeWidth={2}
          type="monotone"
        />

        <Line
          name="Staked MKR "
          originalKey="totalStaked"
          dataKey={selectedLines.length === 0 || !selectedLines.includes('totalStaked') ? 'totalStaked' : ''}
          strokeOpacity={opacities['totalStaked']}
          dot={false}
          isAnimationActive={!modalProps.data}
          stroke="#8889dd"
          strokeWidth={2}
          type="monotone"
        />
        <Line
          name="Voting MKR"
          originalKey="votingMkr"
          strokeOpacity={opacities['votingMkr']}
          dataKey={selectedLines.length === 0 || !selectedLines.includes('votingMkr') ? 'votingMkr' : ''}
          dot={false}
          isAnimationActive={!modalProps.data}
          stroke="#ff7300"
          strokeWidth={2}
          type="monotone"
        />

        <Line
          strokeOpacity={opacities['nonVotingMkr']}
          originalKey="nonVotingMkr"
          dataKey={selectedLines.length === 0 || !selectedLines.includes('nonVotingMkr') ? 'nonVotingMkr' : ''}
          name="Non-Voting MKR"
          dot={false}
          isAnimationActive={!modalProps.data}
          stroke="#a5d297"
          strokeWidth={2}
          type="monotone"
        />
      </Chart>
    </ChartWrapper>
  )
}

export default StakedMkrChart
