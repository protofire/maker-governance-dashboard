import React from 'react'
import styled from 'styled-components'
import { NavLink } from 'react-router-dom'

const HamburgerContainer = styled.div`
  display: flex;
  flex-direction: column;
  position: absolute;
  top: 62px;
  transition: all 0.5s ease-in-out;
  width: 100%;
`
const Menu = styled.div`
  position: relative;
  display: flex;
  flex: 1;
  flex-direction: column;
  background: #fff;
  border: solid 1px #d9d9d9;
  z-index: 999;

  &:first-child {
    border-top: none;
  }
`

const StyledLink = styled(NavLink)`
  color: #666;
  text-decoration: none;

  &:hover {
    color: #000 !important;
  }
  &:visited,
  &:active {
    color: #666;
  }
`

export const Item = styled.div`
  color: #666;
  display: flex;
  flex: 1;
  padding: 1rem;

  div {
    margin: 0 auto;
  }
  &:hover,
  &:focus {
    background: #00ba9c;
    color: #fff;
    font-weight: 600;
  }
`

const HamburgerContent = props => {
  const { items, handleMenu } = props
  return (
    <HamburgerContainer>
      {items.map(({ to, label }) => (
        <Menu>
          <StyledLink key={to} to={to}>
            <Item onClick={handleMenu}>
              <div>{label}</div>
            </Item>
          </StyledLink>
        </Menu>
      ))}
    </HamburgerContainer>
  )
}

export default HamburgerContent
