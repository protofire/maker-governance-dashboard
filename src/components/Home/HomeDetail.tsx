import React, { useEffect, useState } from 'react'
import styled from 'styled-components'

import { mockedData } from '../../utils' //This is only for testing
import { GetPolls_polls } from '../../types/generatedGQL'
import { Card, ChartTitle, TableContainer, Table, TableTitle, TitleContainer, Chart, Modal, CloseIcon } from '../common'
import { Pollcolumns } from '../../utils'
import { Line } from 'recharts'

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
      width: 100% !important;
    }
  }
`

type Props = {
  polls: Array<GetPolls_polls>
  subscribeToChanges: () => void
}

function HomeDetail(props: Props) {
  const { polls, subscribeToChanges } = props
  const pollcolumns = React.useMemo(Pollcolumns, [])

  const [isModalOpen, setModalOpen] = useState(false)
  const [modalData, setModalData] = useState(null)

  const getGraph1 = (inModal = false) => (
    <>
      <TitleContainer>
        <ChartTitle>This is the chart title</ChartTitle>
        {!inModal && <span onClick={() => setModal(getGraph1)}>EXPAND IT</span>}
        {inModal && (
          <span onClick={() => setModalOpen(false)}>
            <CloseIcon />
          </span>
        )}
      </TitleContainer>
      <Chart modalStyles={inModal ? { width: '99%', aspect: 3 } : undefined} width={100} height={400} data={mockedData}>
        <Line name="Number of voters - Current 1000" stroke="red" strokeWidth={2} type="monotone" dataKey="pv" />
        <Line name="Total MKR stacked - Current 2000" stroke="blue" strokeWidth={2} type="monotone" dataKey="uv" />
      </Chart>
    </>
  )

  const setModal = (cb: Function): void => {
    setModalOpen(true)
    setModalData(cb(true))
  }

  useEffect(() => {
    subscribeToChanges()
  })

  return (
    <>
      <Card style={{ height: 300 }}>{getGraph1()}</Card>
      <WrappedContainer>
        <Card style={{ height: 300 }}>
          <ChartTitle>This is the chart title</ChartTitle>
          <Chart width={100} height={400} data={mockedData}>
            <Line name="Number of voters - Current 1000" stroke="red" strokeWidth={2} type="monotone" dataKey="pv" />
            <Line name="Total MKR stacked - Current 2000" stroke="blue" strokeWidth={2} type="monotone" dataKey="uv" />
          </Chart>
        </Card>
        <Card type="table" style={{ height: 340, padding: 0 }}>
          <TableContainer>
            <TitleContainer>
              <TableTitle>Top polls</TableTitle>
            </TitleContainer>
            <Table columns={pollcolumns} data={polls} />
          </TableContainer>
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
      <Modal isOpen={isModalOpen} closeModal={() => setModalOpen(false)}>
        {modalData}
      </Modal>
    </>
  )
}

export default HomeDetail
