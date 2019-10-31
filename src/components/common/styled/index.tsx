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
  color: ${props => props.theme.colors.primary};
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
  font-size: 14px;
  margin-bottom: 0;
`

export const ChartTitleContainer = styled.div`
  display: flex;
  flex-direction: row;
  flex-grow: 0;
  flex-shrink: 0;
  font-size: 14px;
  min-height: 0;

  span {
    margin-right: 3px;
  }
`

export const TitleContainer = styled.div`
  display: flex;
  flex-direction: row;
  flex-grow: 0;
  flex-shrink: 0;
  font-size: 14px;
  min-height: 0;
  justify-content: space-between;
  margin: 0 0 15px;
  padding: 0;

  @media (max-width: 768px) {
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
  flex-grow: 1;
  flex-shrink: 0;
  margin-left: -${props => props.theme.cards.paddingHorizontal};
  margin-right: -${props => props.theme.cards.paddingHorizontal};
  max-height: none;
  min-height: fit-content;
  width: calc(100% + 40px) !important;

  table {
    border-collapse: separate;
    border-spacing: 10px 5px;

    th {
      color: ${props => props.theme.table.thColor};
      font-size: 12px;
    }

    tbody {
      color: ${props => props.theme.table.tdColor};
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
