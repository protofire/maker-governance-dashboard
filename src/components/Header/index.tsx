import React, { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { toNiceDate } from '../../utils'
import styled, { css } from 'styled-components'
import HamburgerMenu from 'react-hamburger-menu'

const Overlay = styled.div`
  background-color: rgba(0, 0, 0, 0.5);
  bottom: 0;
  height: 100%;
  left: 0;
  position: fixed;
  right: 0;
  top: 0;
  width: 100%;
  z-index: 2;
`

const Nav = styled.div`
  background-color: #fff;
  border-bottom: 1px solid rgba(0, 0, 0, 0.0975);
  border: solid 1px #d9d9d9;
  display: flex;
  height: 60px;

  ${props =>
    props.overlay &&
    css`
      position: absolute;
      width: 100%;
      z-index: 999;
    `}
`
const NavHeader = styled.div`
  align-items: center;
  display: flex;
  flex-direction: row;
  flex: 1;
  font-size: 14px;
  justify-content: center;
`
const NavLeft = styled.div`
  align-items: center;
  display: flex;
  margin: 0 auto;
  max-width: 1140px;
  padding: 2rem 2.5rem;

  a {
    align-items: center;
    display: flex;
    font-weight: 500;
    margin-left: 2rem;
  }

  @media (max-width: 480px) {
    margin-left: 10px;
    padding-left: 0;
    padding-right: 0;
  }
`
const NavRightTitle = styled.span``

const NavRight = styled.div`
  display: flex;
  flex-direction: row-reverse;
  margin: 0 auto;
  max-width: 1140px;

  @media (max-width: 480px) {
    flex-direction: row;
    font-size: 12px;
    justify-content: center;

    ${NavRightTitle} {
      margin-left: 1rem;
    }
  }
  span {
    margin-right: 1rem;
  }
`

const RightMenu = styled(NavRight)`
  margin-right: 10px;
  position: relative;

  @media (min-width: 480px) {
    display: none;
  }
  @media (max-width: 480px) {
    justify-content: flex-end;
  }
`

const Breadcrumb = styled.div`
  display: flex;

  @media (max-width: 480px) {
    display: none;
  }
`
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
const Item = styled.div`
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

interface Item {
  to: string
  label: string
}

type Props = {
  items: Item[]
  lastSynced?: string
}

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

function Header(props: Props) {
  const { items, lastSynced } = props
  const [isOpenMenu, setOpenMenu] = useState(false)
  return (
    <>
      {isOpenMenu && <Overlay />}
      <Nav overlay={isOpenMenu}>
        <NavHeader>
          <NavLeft>
            <img alt="logo" src="/maker.png" />
            <Breadcrumb>
              {items.map(({ to, label }) => (
                <StyledLink exact activeStyle={{ color: '#000' }} key={to} to={to}>
                  {label}
                </StyledLink>
              ))}
            </Breadcrumb>
          </NavLeft>
          <NavRight>
            <NavRightTitle>
              Mainnet | Last sync: <strong>{lastSynced && toNiceDate(lastSynced)}</strong>
            </NavRightTitle>
          </NavRight>
          <RightMenu>
            <HamburgerMenu
              animationDuration={0.5}
              borderRadius={0}
              color="#000"
              height={17}
              isOpen={isOpenMenu}
              menuClicked={() => setOpenMenu(!isOpenMenu)}
              rotate={0}
              strokeWidth={1}
              width={25}
            />
          </RightMenu>
        </NavHeader>
      </Nav>
      {isOpenMenu && <HamburgerContent handleMenu={() => setOpenMenu(false)} items={items} />}
    </>
  )
}
export default Header
