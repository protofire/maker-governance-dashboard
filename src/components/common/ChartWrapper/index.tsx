import React from 'react'
import styled from 'styled-components'

import { ChartTitle, ExpandIcon, ChartSelect } from '../../common'
import { TitleContainer } from '../styled/index'
import { filters, getIconContainer } from '../../../utils'
type Props = {
  value: string
  onChange: (e: any) => void
  handleModal: () => void
  content: string
  versus?: string
  children: React.ReactNode
  isModalOpen: boolean
  hideFilters: boolean
  styles: any
}

const ChartTitleContainer = styled(TitleContainer)`
  padding-top: 9px;
`

function ChartWrapper(props: Props) {
  const { value, onChange, handleModal, children, content, versus, isModalOpen, styles, hideFilters } = props
  return (
    <>
      <ChartTitleContainer style={styles} type="chart">
        <ChartTitle content={content} versus={versus}>
          {!hideFilters && <ChartSelect value={value} values={filters} onChange={onChange} />}
        </ChartTitle>
        {getIconContainer(ExpandIcon, handleModal, isModalOpen)}
      </ChartTitleContainer>
      {children}
    </>
  )
}

export default ChartWrapper
