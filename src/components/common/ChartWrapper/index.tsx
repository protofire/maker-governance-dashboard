import React from 'react'
import { ChartTitle, ExpandIcon, ChartSelect } from '../../common'
import { TitleContainer } from '../styled/index'
import { filters, getIconContainer } from '../../../utils'

type Props = {
  children: React.ReactNode
  content: string
  handleModal: () => void
  hideFilters: boolean
  hideIcon: boolean
  isModalOpen: boolean
  onChange: (e: any) => void
  styles: any
  value: string
  versus?: string
}

function ChartWrapper(props: Props) {
  const { value, onChange, handleModal, children, content, versus, isModalOpen, styles, hideFilters, hideIcon } = props
  return (
    <>
      <TitleContainer style={styles} type="chart">
        <ChartTitle content={content} versus={versus}>
          {!hideFilters && <ChartSelect value={value} values={filters} onChange={onChange} />}
        </ChartTitle>
        {!hideIcon && getIconContainer(ExpandIcon, handleModal, isModalOpen)}
      </TitleContainer>
      {children}
    </>
  )
}

export default ChartWrapper
