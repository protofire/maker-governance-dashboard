import styled, { css } from 'styled-components'

export const Card = styled.div`
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

  ${props =>
    props.type &&
    css`
      flex: unset !important;
    `}
`
export const Versus = styled.span`
  color: #bbb;
`
export const Separator = styled(Versus)`
  margin-right: 0;
`

export const Select = styled.select`
  background: transparent;
  border: none;
  margin-right: 1rem;

  &:focus {
    outline: 0;
  }
`
export const ChartSelect = styled(Select)`
  color: #00ba9c;
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

const ChartTitle = styled.p`
  color: ${props => props.theme.colors.textCommon};
  font-size: 14px;
  margin-top: 0;
`
export const TableTitle = styled(ChartTitle)`
  font-size: 13px;
  margin-bottom: 0;
`
export const ChartTitleContainer = styled.div`
  display: flex;
  flex-direction: row;
  flex: 1;
  font-size: 14px;
  span {
    margin-right: 5px;
  }
`

export const TitleContainer = styled.div`
  align-items: center;
  display: flex;
  flex-direction: row;
  flex: 1;
  justify-content: space-between;
  padding: 16px;

  @media (max-width: 768px) {
    ${props =>
      props.type &&
      css`
        padding-right: 0;
        padding-left: 0;
      `}

    ${Separator} {
      display: none;
    }
    ${ChartTitleContainer} {
      flex-wrap: wrap;
    }
    select {
      width: 85px;
    }
  }
`

export const IconContainer = styled.div`
  cursor: pointer;
  display: flex;
`

export const TableContainer = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;

  table {
    border-collapse: separate;
    border-spacing: 10px 5px;
    th {
      color: #999;
      font-size: 12px;
    }
    tbody {
      color: #000;
      font-size: 13px;
      tr {
        &:nth-child(odd) {
          background-color: #fafafa;
        }
        height: 36px;
      }
    }
  }
`

export const ViewAll = styled.span`
  color: #00ba9c;
  font-size: 12px;
`

export const DescriptionBox = styled.div`
  color: #777;
  font-size: 13px;
  margin: 0 auto;
  max-width: ${props => (!props.expanded ? '300px' : 'none')};
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

  @media (min-width: ${props => props.theme.themeBreakPoints.md}) {
    grid-template-columns: 1fr 1fr 1fr;
  }
`

export const TwoRowGridLeftNarrow = styled.div`
  column-gap: ${props => props.theme.separation.gridSeparation};
  display: grid;
  grid-template-columns: 1fr;

  @media (min-width: ${props => props.theme.themeBreakPoints.md}) {
    grid-template-columns: 1fr 2fr;
  }
`

export const TwoRowGridRightNarrow = styled.div`
  column-gap: ${props => props.theme.separation.gridSeparation};
  display: grid;
  grid-template-columns: 1fr;

  @media (min-width: ${props => props.theme.themeBreakPoints.md}) {
    grid-template-columns: 1fr 2fr;
  }
`
