import React from 'react'
import styled, { keyframes } from 'styled-components'
import SpinnerSVG from './img/SpinnerSVG'

const rotate = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`

const RotatingSpinner = styled.div<{ height: string; width: string; color: string }>`
  animation: ${rotate} 4s linear infinite;
  height: ${props => props.height};
  width: ${props => props.width};

  > svg {
    display: block;
  }
`

export const SpinnerContainer = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  width: 100%;
  justify-content: center;
`

const Spinner = props => {
  const { width = '20px', height = '20px', color = '#333', ...restProps } = props

  return (
    <RotatingSpinner width={width} height={height} color={color} {...restProps}>
      <SpinnerSVG width={width} height={height} color={color} />
    </RotatingSpinner>
  )
}

export default Spinner
