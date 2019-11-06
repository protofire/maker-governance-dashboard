import React from 'react'
import ReactDOM from 'react-dom'
import Spinner from '../Spinner'
import styled from 'styled-components'

const FullLoadingStyled = styled.div`
  align-items: center;
  background-color: rgba(0, 0, 0, 0.35);
  display: flex;
  flex-direction: column;
  height: 100vh;
  justify-content: center;
  left: 0;
  position: fixed;
  top: 0;
  width: 100vw;
  z-index: 12345;
`

const Message = styled.p`
  color: #fff;
  font-size: 15px;
  font-weight: 600;
  line-height: 1.2;
  margin: 0 auto;
  max-width: 100%;
  padding: 10px ${props => props.theme.paddings.mainPadding} 0;
  text-align: center;
  width: 480px;
`

const FullLoading = props => {
  const { message = 'Loading...', ...restProps } = props
  return ReactDOM.createPortal(
    <FullLoadingStyled {...restProps}>
      <Spinner width="40px" height="40px" color="#fff" />
      {message ? <Message>{message}</Message> : null}
    </FullLoadingStyled>,
    document.getElementById('loadingContainer') as HTMLDivElement,
  )
}

export default FullLoading
