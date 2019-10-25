import React from 'react'
import styled from 'styled-components'
import LogoImage from './img/logo@3x.png'

const LogoWrapper = styled.div`
  background-image: url(${LogoImage});
  background-position: 50% 50%;
  background-repeat: no-repeat;
  background-size: contain;
  height: 32px;
  width: 45px;
`

const Logo: React.FC = props => {
  const { ...restProps } = props

  return <LogoWrapper {...restProps} />
}

export default Logo
