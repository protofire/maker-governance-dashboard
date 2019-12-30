import React, { useState } from 'react'
import styled from 'styled-components'

import { StrippedRowsContainer, CardTitle, ViewAll, Modal, InfoIcon, CloseIcon, DescriptionBox } from '..'
import { getIconContainer } from '../../../utils'
import { IconContainer } from '../styled'

const TitleWrapper = styled.div`
  flex-shrink: 0;
  margin-bottom: -15px;
  padding: ${props => props.theme.cards.paddingVertical} ${props => props.theme.cards.paddingHorizontal} 0
    ${props => props.theme.cards.paddingHorizontal};

  .ReactModal__Content & {
    padding: 0;
  }
`

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
  flex-direction: column;
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
  handleModal?: () => void
  isModalOpen?: boolean
  info?: string
  links?: Array<any>
}

function StrippedTableWrapper(props: Props) {
  const { handleModal, children, content, isModalOpen, info, links } = props
  const [isInfoModalOpen, setInfoModalOpen] = useState(false)

  return (
    <>
      <TitleWrapper>
        <CardTitle content={content}>
          <Right>
            <InfoIconContainer>{info && <InfoIcon onClick={() => setInfoModalOpen(true)} />}</InfoIconContainer>
            {handleModal ? getIconContainer(() => <ViewAll>View All</ViewAll>, handleModal, isModalOpen) : null}
          </Right>
        </CardTitle>
      </TitleWrapper>
      <StrippedRowsContainer>{children}</StrippedRowsContainer>
      <Modal
        styles={{ content: { position: 'relative', width: '768px' } }}
        isOpen={isInfoModalOpen}
        closeModal={() => setInfoModalOpen(false)}
      >
        <InfoContainer onClick={() => setInfoModalOpen(false)}>
          <CloseIcon />
        </InfoContainer>
        <div>
          <CardTitle content={`${content} Info`} />
          <DescriptionBox>
            {info}
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

export default StrippedTableWrapper
