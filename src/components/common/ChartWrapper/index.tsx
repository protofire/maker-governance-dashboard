import React from 'react'
import { CardTitle, ExpandIcon, ChartSelect } from '../../common'
import { filters, getIconContainer } from '../../../utils'
import styled from 'styled-components'

const Right = styled.div`
  margin-left: auto;
`

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
  const { value, onChange, handleModal, children, content, versus, isModalOpen, hideFilters, hideIcon } = props
  return (
    <>
      <CardTitle content={content} versus={versus}>
        {!hideFilters && <ChartSelect value={value} values={filters} onChange={onChange} />}
        <Right>{!hideIcon && getIconContainer(ExpandIcon, handleModal, isModalOpen)}</Right>
      </CardTitle>
      {children}
    </>
  )
}

export default ChartWrapper
