import React from 'react'
import { Bar, Cell, YAxis } from 'recharts'
import { Chart, ChartWrapper } from '../../common'

const CustomSvg = (props: any) => (
  <>
    {/*
   // @ts-ignore */}
    <svg
      className="recharts-surface"
      width="14"
      height="14"
      viewBox="0 0 32 32"
      version="1.1"
      style={{ display: 'inline-block', verticalAlign: 'middle', marginRight: '4px' }}
    >
      {/*
   // @ts-ignore */}
      <path stroke="none" fill={props.color} d="M0,4h32v24h-32z" className="recharts-legend-icon"></path>
    </svg>
  </>
)

const renderLegend = props => {
  const { data } = props
  const casted = !!data.find(el => el.casted)
  const isNext = !!data.find(el => el.isNext)
  return (
    <ul style={{ listStyleType: 'none' }}>
      <li>
        <CustomSvg color={casted ? '#27a02c' : '#ffc353'} />
        <span>Executive vote</span>
      </li>
      <li>
        <CustomSvg color={'#a04827'} />
        <span>{isNext ? 'Next Highest Executive' : 'Current Hat'}</span>
      </li>
    </ul>
  )
}

const ExecutiveVsHatChart = props => {
  const { wrapperProps, modalProps } = props
  return (
    <ChartWrapper {...wrapperProps} hideFilters>
      <Chart {...modalProps} legend={renderLegend}>
        <YAxis />
        <Bar isAnimationActive={modalProps.data ? false : true} dataKey="mkr">
          {modalProps.data.map((entry, index) => (
            <Cell
              key={`cell-${index}`}
              fill={entry.isHat || entry.isNext ? '#a04827' : entry.casted ? '#27a02c' : '#ffc353'}
            />
          ))}
        </Bar>
      </Chart>
    </ChartWrapper>
  )
}

export default ExecutiveVsHatChart
