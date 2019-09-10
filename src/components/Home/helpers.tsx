import React from 'react'
import styled from 'styled-components'
import { IconContainer, TitleContainer, CloseIcon, TableTitle, ChartTitle, Card } from '../common'

export const getIconContainer = (Component, data, cb, isChart = false) => {
  return (
    <IconContainer onClick={() => cb(data, isChart)}>
      <Component />
    </IconContainer>
  )
}

export const getModalContainer = (type, Content, title, props, closeCallback) => {
  const Title = type === 'table' ? TableTitle : ChartTitle
  return (
    <>
      <TitleContainer>
        <Title>{title}</Title>
        <IconContainer onClick={() => closeCallback(false)}>
          <CloseIcon />
        </IconContainer>
      </TitleContainer>
      <Content {...props} />
    </>
  )
}

export const ViewAll = styled.span`
  font-size: 12px;
  color: #00ba9c;
`

export const WrappedContainer = styled.div`
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
