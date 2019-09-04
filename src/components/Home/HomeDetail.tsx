import React, { useEffect } from 'react'
import styled from 'styled-components'

import { mockedData } from '../../utils' //This is only for testing
import { GetGovernanceInfo_governanceInfo } from '../../types/generatedGQL'
import { Card, ChartTitle } from '../common/styled'
import { Line } from 'recharts'
import Chart from '../common/Chart'

const WrappedContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  flex-wrap: wrap;
  ${Card} {
    width: 25%;
  }
  @media (max-width: 768px) {
    ${Card} {
      width: 40%;
    }
  }
  @media (max-width: 580px) {
    ${Card} {
      width: 100%;
    }
  }
`

type Props = {
  data: GetGovernanceInfo_governanceInfo
  subscribeToChanges: () => void
}

function HomeDetail(props: Props) {
  const { data, subscribeToChanges } = props

  useEffect(() => {
    subscribeToChanges()
  })

  return (
    <>
      <Card style={{ height: 300 }}>
        <ChartTitle>This is the chart title</ChartTitle>
        <Chart width={400} height={400} data={mockedData}>
          <Line name="Number of voters - Current 1000" stroke="red" strokeWidth={2} type="monotone" dataKey="pv" />
          <Line name="Total MKR stacked - Current 2000" stroke="blue" strokeWidth={2} type="monotone" dataKey="uv" />
        </Chart>
      </Card>
      <WrappedContainer>
        <Card style={{ height: 300 }}>
          <ChartTitle>This is the chart title</ChartTitle>
          <Chart width={100} height={400} data={mockedData}>
            <Line name="Number of voters - Current 1000" stroke="red" strokeWidth={2} type="monotone" dataKey="pv" />
            <Line name="Total MKR stacked - Current 2000" stroke="blue" strokeWidth={2} type="monotone" dataKey="uv" />
          </Chart>
        </Card>
        <Card style={{ height: 300 }}>
          <ChartTitle>This is the chart title</ChartTitle>
          <Chart width={100} height={400} data={mockedData}>
            <Line name="Number of voters - Current 1000" stroke="red" strokeWidth={2} type="monotone" dataKey="pv" />
            <Line name="Total MKR stacked - Current 2000" stroke="blue" strokeWidth={2} type="monotone" dataKey="uv" />
          </Chart>
        </Card>
        <Card style={{ height: 300 }}>
          <ChartTitle>This is the chart title</ChartTitle>
          <Chart width={100} height={400} data={mockedData}>
            <Line name="Number of voters - Current 1000" stroke="red" strokeWidth={2} type="monotone" dataKey="pv" />
            <Line name="Total MKR stacked - Current 2000" stroke="blue" strokeWidth={2} type="monotone" dataKey="uv" />
          </Chart>
        </Card>
        <Card style={{ height: 300 }}>
          <ChartTitle>This is the chart title</ChartTitle>
          <Chart width={100} height={400} data={mockedData}>
            <Line name="Number of voters - Current 1000" stroke="red" strokeWidth={2} type="monotone" dataKey="pv" />
            <Line name="Total MKR stacked - Current 2000" stroke="blue" strokeWidth={2} type="monotone" dataKey="uv" />
          </Chart>
        </Card>
        <Card style={{ height: 300 }}>
          <ChartTitle>This is the chart title</ChartTitle>
          <Chart width={100} height={400} data={mockedData}>
            <Line name="Number of voters - Current 1000" stroke="red" strokeWidth={2} type="monotone" dataKey="pv" />
            <Line name="Total MKR stacked - Current 2000" stroke="blue" strokeWidth={2} type="monotone" dataKey="uv" />
          </Chart>
        </Card>
        <Card style={{ height: 300 }}>
          <ChartTitle>This is the chart title</ChartTitle>
          <Chart width={100} height={400} data={mockedData}>
            <Line name="Number of voters - Current 1000" stroke="red" strokeWidth={2} type="monotone" dataKey="pv" />
            <Line name="Total MKR stacked - Current 2000" stroke="blue" strokeWidth={2} type="monotone" dataKey="uv" />
          </Chart>
        </Card>
      </WrappedContainer>
    </>
  )
}

export default HomeDetail
