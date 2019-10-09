import React from 'react'
import styled from 'styled-components'
type Props = {
  table?: boolean
}
export const Spinner = ({ table }: Props) => (
  <StyledSpinner table={table} viewBox="0 0 50 50">
    <circle className="path" cx="25" cy="25" r="20" fill="none" strokeWidth="2" />
  </StyledSpinner>
)

const StyledSpinner = styled.svg`
  animation: rotate 1.5s linear infinite;
  margin: ${props => (props.table ? '0' : '40px')};
  width: ${props => (props.table ? '20px' : '50px')};
  height: ${props => (props.table ? '20px' : '50px')};

  & .path {
    stroke: rgb(14, 16, 41);
    stroke-linecap: round;
    animation: dash 1.5s ease-in-out infinite;
  }

  @keyframes rotate {
    100% {
      transform: rotate(360deg);
    }
  }
  @keyframes dash {
    0% {
      stroke-dasharray: 1, 150;
      stroke-dashoffset: 0;
    }
    50% {
      stroke-dasharray: 90, 150;
      stroke-dashoffset: -35;
    }
    100% {
      stroke-dasharray: 90, 150;
      stroke-dashoffset: -124;
    }
  }
`
export const SpinnerContainer = styled.div`
  margin: 0 auto;
  display: flex;
  flex: 1;
  flex-direction: column;
  align-items: center;
`
