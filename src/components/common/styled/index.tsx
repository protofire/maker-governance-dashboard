import React from 'react'
import styled, { css } from 'styled-components'

export const Card = styled.div`
  align-items: flex-start;
  background-color: ${props => props.theme.cards.backgroundColor};
  border-radius: ${props => props.theme.cards.borderRadius};
  border: ${props => props.theme.cards.border};
  box-shadow: ${props => props.theme.cards.boxShadow};
  display: flex;
  flex-direction: column;
  font-size: 16px;
  font-weight: 400;
  overflow: hidden;
  padding: ${props => props.theme.cards.paddingVertical} ${props => props.theme.cards.paddingHorizontal};
  position: relative;

  > div {
    width: 100%;
  }
`

export const PageTitle = styled.h1`
  color: ${props => props.theme.colors.textCommon};
  font-size: 20px;
  font-weight: normal;
  line-height: 1.35;
  margin: 0 0 16px;
  padding: 0;
  text-align: left;
`

export const Link = styled.a`
  color: #000;
  font-size: 13px;
`

const CommonCardTitleCSS = css`
  font-size: 14px;
  font-weight: 400;
  line-height: 1.2;
`

const CardTitleText = styled.h3`
  ${CommonCardTitleCSS}
  color: ${props => props.theme.colors.textCommon};
  margin: 0;
`

export const CardTitleContainer = styled.div`
  align-items: center;
  display: flex;
  flex-direction: row;
  flex-grow: 1;
  flex-shrink: 0;
  margin-bottom: 15px;
`

export const CardTitleLeftContents = styled.div`
  display: flex;
  flex-direction: row;
  flex-grow: 0;
  flex-shrink: 0;
`

export const Versus = styled.span`
  ${CommonCardTitleCSS}
  color: #bbb;
  margin: 0 5px;
`

export const VersusText = styled.span`
  ${CommonCardTitleCSS}
`

export const Separator = styled(Versus)`
  ${CommonCardTitleCSS}
  color: #bbb;
  font-weight: 700;
  margin: 0 0 0 5px;

  &:last-child {
    display: none;
  }
`

export const Select = styled.select`
  background: transparent;
  border: none;
  font-size: 13px;

  &:focus {
    outline: 0;
  }
`

export const ChartSelect = styled(Select)`
  color: ${props => props.theme.colors.primary};
`

export const CardTitle = props => {
  const { content, versus, children } = props

  return (
    <CardTitleContainer>
      {content || versus ? (
        <CardTitleLeftContents>
          <CardTitleText>{content}</CardTitleText>
          {versus && (
            <>
              <Versus>vs</Versus> <VersusText>{versus}</VersusText>
            </>
          )}
          <Separator>&middot;</Separator>
        </CardTitleLeftContents>
      ) : null}
      {children ? children : null}
    </CardTitleContainer>
  )
}

export const IconContainer = styled.div`
  cursor: pointer;
  display: flex;
`

export const StrippedRowsContainer = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  font-size: 12px;
`

export const ViewAll = styled.span`
  color: ${props => props.theme.colors.primary};
  font-size: 12px;
`

export const DescriptionBox = styled.div`
  color: #777;
  font-size: 13px;
  margin: 0 auto;
  overflow: hidden;
  text-overflow: ellipsis;
  width: 100%;

  ${props =>
    props.expanded &&
    css`
      max-height: 800px;
      overflow: scroll;
    `}
`

export const ThreeRowGrid = styled.div`
  column-gap: ${props => props.theme.separation.gridSeparation};
  display: grid;
  grid-template-columns: 1fr;
  row-gap: ${props => props.theme.separation.gridSeparation};

  @media (min-width: ${props => props.theme.themeBreakPoints.xl}) {
    grid-template-columns: 1fr 1fr 1fr;
  }
`

export const NoData = styled.div`
  align-items: center;
  display: flex;
  flex-grow: 1;
  font-size: 16px;
  justify-content: center;
  line-height: 1.2;
`

export const StrippedTableRow = styled.div`
  display: flex;
  flex: 1;
  padding: 0.25rem 1.5rem;
  align-items: center;
  justify-content: space-between;

  &:nth-child(odd) {
    background-color: #fafafa;
  }
`

export const StrippedTableCell = styled.span`
  color: #000;
  font-size: 13px;
`
