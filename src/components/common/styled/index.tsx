import styled, { css } from 'styled-components'

export const Card = styled.div`
  display: flex;
  margin-top: 12px;
  flex-direction: column;
  text-align: left;
  padding: 20px 24px;
  border-radius: 4px;
  display: flex;
  position: relative;
  background-color: rgb(255, 255, 255);
  font-size: 16px;
  font-weight: 400;
  text-align: left;
  overflow: hidden;
  border: 1px solid rgb(212, 217, 225);
  ${props =>
    props.type &&
    css`
      width: 32.5% !important;
      flex: unset !important;
    `}
  @media (max-width: 768px) {
    ${props =>
      props.type &&
      css`
        width: 46.5% !important;
      `}
  }
`
export const Versus = styled.span`
  color: #bbbbbb;
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
export const PageTitle = styled.p`
  font-size: 20px;
  color: #444444;
  margin-top: 22px;
`
export const Link = styled.a`
  font-size: 13px;
  color: #000000;
`

const ChartTitle = styled.p`
  margin-top: 0;
  font-size: 14px;
  color: #444444;
`
export const TableTitle = styled(ChartTitle)`
  font-size: 14px;
  margin-bottom: 0;
`
export const ChartTitleContainer = styled.div`
  display: flex;
  font-size: 14px;
  color: #444444;
  font-weigth: 600;
  flex-direction: row;
  flex: 1;
  span {
    margin-right: 3px;
  }
`

export const TitleContainer = styled.div`
  display: flex;
  flex: 1;
  padding: 16px;
  align-items: center;
  display: flex;
  flex: 1;
  flex-direction: row;
  justify-content: space-between;
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
  display: flex;
  cursor: pointer;
`

export const TableContainer = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  table {
    border-collapse: separate;
    border-spacing: 10px 5px;
    th {
      font-size: 12px;
      color: #999999;
    }
    tbody {
      font-size: 13px;
      color: #000000;
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
  font-size: 12px;
  color: #00ba9c;
`
export const DescriptionBox = styled.div`
  max-width: ${props => (!props.expanded ? '300px' : 'none')};
  width: 100%;
  color: #777777;
  margin: 0 auto;
  font-size: 13px;
  overflow: auto;
  text-overflow: ellipsis;
  ${props =>
    props.expanded &&
    css`
      max-height: 800px;
    `}
`
