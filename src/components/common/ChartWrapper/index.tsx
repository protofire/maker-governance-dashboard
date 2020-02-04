import React, { useState } from 'react'
import ReactMarkdown from 'react-markdown'
import { CardTitle, ExpandIcon, ChartSelect, Modal, InfoIcon, CloseIcon, DescriptionBox } from '../../common'
import { filters, getIconContainer } from '../../../utils'
import { IconContainer } from '../../common/styled'
import styled from 'styled-components'

const Right = styled.div`
  margin-left: auto;
  display: flex;
`
const InfoContainer = styled(IconContainer)`
  flex-direction: row-reverse;
`
const InfoIconContainer = styled.div`
  display: flex;
  position: relative;
  bottom: 2px;
  right: 5px;
  cursor: pointer;
`
const LinksContainer = styled.div`
  margin-top: 10px;
  display: flex;
  justify-content: space-between;
  a {
    &:visited,
    &:active {
      color: #444;
    }
  }
`

type Props = {
  children: React.ReactNode
  content: string
  handleModal: () => void
  hideFilters: boolean
  hideIcon: boolean
  isModalOpen: boolean
  markdown?: boolean
  onChange: (e: any) => void
  styles: any
  value: string
  versus?: string
  info?: string
  links?: Array<any>
}

function ChartWrapper(props: Props) {
  const {
    value,
    markdown,
    onChange,
    handleModal,
    children,
    content,
    versus,
    isModalOpen,
    hideFilters,
    hideIcon,
    info,
    links,
  } = props
  const [isInfoModalOpen, setInfoModalOpen] = useState(false)

  return (
    <>
      <CardTitle content={content} versus={versus}>
        {!hideFilters && <ChartSelect value={value} values={filters} onChange={onChange} />}
        <Right>
          <InfoIconContainer>{info && <InfoIcon onClick={() => setInfoModalOpen(true)} />}</InfoIconContainer>
          {!hideIcon && getIconContainer(ExpandIcon, handleModal, isModalOpen)}
        </Right>
      </CardTitle>
      {children}
      <Modal
        styles={{ content: { position: 'relative', width: '768px' } }}
        isOpen={isInfoModalOpen}
        closeModal={() => setInfoModalOpen(false)}
      >
        <InfoContainer onClick={() => setInfoModalOpen(false)}>
          <CloseIcon />
        </InfoContainer>
        <div>
          <CardTitle content={`${content} ${versus ? 'vs' : ''} ${versus || ''} Info`} />
          <DescriptionBox>
            {!markdown ? info : <ReactMarkdown escapeHtml={false} source={info} />}
            <LinksContainer>
              {links &&
                links.map(link => (
                  <a target="_blank" rel="noopener noreferrer" key={link.title} href={link.uri}>
                    {link.title}
                  </a>
                ))}
            </LinksContainer>
          </DescriptionBox>
        </div>
      </Modal>
    </>
  )
}

export default ChartWrapper
