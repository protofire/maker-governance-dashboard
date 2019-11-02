import React from 'react'
import styled from 'styled-components'
import { NavLink } from 'react-router-dom'

export const Overlay = styled.div`
  background-color: rgba(0, 0, 0, 0.35);
  bottom: 0;
  height: 100%;
  left: 0;
  position: fixed;
  right: 0;
  top: 0;
  width: 100%;
  z-index: 4;
`

const Menu = styled.div`
  background-color: #fff;
  box-shadow: 0 3px 8px 0 rgba(0, 0, 0, 0.22);
  display: flex;
  flex-direction: column;
  flex: 1;
  position: absolute;
  position: relative;
  top: ${props => props.theme.header.height};
  width: 100%;
  z-index: 999;
`

const StyledLink = styled(NavLink)`
  align-items: center;
  border-bottom: 1px solid ${props => props.theme.borders.borderColor};
  color: ${props => props.theme.mainMenu.color};
  display: flex;
  height: 45px;
  justify-content: center;
  padding: 0 15px;
  text-decoration: none;

  &:last-child {
    border-bottom: none;
  }

  &:hover {
    color: ${props => props.theme.mainMenu.color};
  }

  &.active,
  &:active {
    background-color: ${props => props.theme.colors.primary};
    color: #fff;
  }
`

const MobileMenu = props => {
  const { items, handleMenu } = props
  return (
    <Overlay onClick={handleMenu}>
      <Menu>
        {items.map(({ to, label }) => (
          <StyledLink exact activeClassName="active" key={to} to={to}>
            {label}
          </StyledLink>
        ))}
      </Menu>
    </Overlay>
  )
}

export default MobileMenu
