import React from 'react'
import { ChartTitle, TitleContainer, ExpandIcon, ChartSelect } from '../../common'
import { filters, getIconContainer } from '../../../utils'
type Props = {
  value: string
  onChange: (e: any) => void
  handleModal: () => void
  content: string
  versus?: string
  children: React.ReactNode
  isModalOpen: boolean
}

function ChartWrapper(props: Props) {
  const { value, onChange, handleModal, children, content, versus, isModalOpen } = props

  return (
    <>
      <TitleContainer type="chart">
        <ChartTitle content={content} versus={versus}>
          <ChartSelect value={value} values={filters} onChange={onChange} />
        </ChartTitle>
        {getIconContainer(ExpandIcon, handleModal, isModalOpen)}
      </TitleContainer>
      {children}
    </>
  )
}

export default ChartWrapper
