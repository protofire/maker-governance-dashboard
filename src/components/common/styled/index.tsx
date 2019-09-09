import styled, { css } from 'styled-components'

export const Card = styled.div`
  display: flex;
  margin-top: 18px;
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
      width: 29.5% !important;
    `}
  @media (max-width: 768px) {
    ${props =>
      props.type &&
      css`
        width: 47% !important;
      `}
  }
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

export const ChartTitle = styled.p`
  margin-top: 0;
  font-size: 14px;
  color: #444444;
`
export const TableTitle = styled(ChartTitle)`
  font-size: 13px;
  margin-bottom: 0;
`
export const TitleContainer = styled.div`
  display: flex;
  flex: 1;
  padding: 16px;
  padding-bottom: 5px;
  display: flex;
  flex: 1;
  flex-direction: row;
  justify-content: space-between;
`
export const IconContainer = styled.div`
  display: flex;
  cursor: pointer;
`

export const TableContainer = styled.div`
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
